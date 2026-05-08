using API.Entities;
using API.Interfaces;
using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;

namespace API.Services;

public class AppointmentNotificationService(
    IConfiguration config,
    IHttpClientFactory httpClientFactory,
    ILogger<AppointmentNotificationService> logger) : IAppointmentNotificationService
{
    private const string AppointmentStatusTemplatePath = "EmailTemplates/AppointmentStatusEmail.html";

    public Task<bool> SendConfirmationAsync(Appointment appointment, AppointmentSettings settings)
    {
        return SendAppointmentStatusAsync(
            appointment,
            settings,
            subject: "Your appointment is confirmed",
            statusLabel: "Confirmed",
            headline: "Your appointment is confirmed",
            preheader: "Your appointment has been confirmed.",
            intro: "Your booking has been reviewed and confirmed. Here are the details for your visit.",
            guidanceTitle: "Before your appointment",
            guidanceBody: "Please arrive on time with clean lashes and avoid eye makeup before your visit. If you need to reschedule, contact us as early as possible.",
            textMessage: $"Hi {appointment.ClientName}, your appointment is confirmed for {appointment.AppointmentDate:yyyy-MM-dd} at {appointment.StartTime:HH\\:mm}.");
    }

    public Task<bool> SendRejectionAsync(Appointment appointment, AppointmentSettings settings)
    {
        return SendAppointmentStatusAsync(
            appointment,
            settings,
            subject: "Your appointment request was not approved",
            statusLabel: "Not approved",
            headline: "Your appointment request was not approved",
            preheader: "We are sorry, but this appointment request could not be approved.",
            intro: "We are sorry, but this appointment request could not be approved for the selected date and time. Please contact us or submit another request for a different time.",
            guidanceTitle: "What you can do next",
            guidanceBody: "You can choose another available time and submit a new appointment request. If you have questions, please contact the studio directly.",
            textMessage: $"Hi {appointment.ClientName}, your appointment request for {appointment.AppointmentDate:yyyy-MM-dd} at {appointment.StartTime:HH\\:mm} was not approved. Please choose another time or contact us.");
    }

    private async Task<bool> SendAppointmentStatusAsync(
        Appointment appointment,
        AppointmentSettings settings,
        string subject,
        string statusLabel,
        string headline,
        string preheader,
        string intro,
        string guidanceTitle,
        string guidanceBody,
        string textMessage)
    {
        if (!settings.SendConfirmationNotifications)
        {
            logger.LogInformation("Appointment notifications are disabled.");
            return false;
        }

        var sent = false;

        if (settings.SendEmail && !string.IsNullOrWhiteSpace(appointment.ClientEmail))
        {
            sent = await SendEmailAsync(
                appointment,
                subject,
                BuildAppointmentStatusEmail(
                    appointment,
                    statusLabel,
                    headline,
                    preheader,
                    intro,
                    guidanceTitle,
                    guidanceBody)) || sent;
        }

        if (settings.SendSms && !string.IsNullOrWhiteSpace(appointment.ClientPhone))
        {
            sent = await SendSmsAsync(appointment, textMessage) || sent;
        }

        return sent;
    }

    private async Task<bool> SendEmailAsync(Appointment appointment, string subject, string body)
    {
        var host = config["Notifications:Smtp:Host"];
        var from = config["Notifications:Smtp:From"];

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(from))
        {
            logger.LogInformation("SMTP settings are missing. Email notification was not sent for appointment {AppointmentId}.", appointment.Id);
            return false;
        }

        using var client = new SmtpClient(host)
        {
            Port = int.TryParse(config["Notifications:Smtp:Port"], out var port) ? port : 587,
            EnableSsl = bool.TryParse(config["Notifications:Smtp:EnableSsl"], out var enableSsl) && enableSsl
        };

        var username = config["Notifications:Smtp:Username"];
        var password = config["Notifications:Smtp:Password"];

        if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password))
        {
            client.Credentials = new NetworkCredential(username, password);
        }

        var message = new MailMessage(from, appointment.ClientEmail)
        {
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
            BodyEncoding = Encoding.UTF8,
            SubjectEncoding = Encoding.UTF8
        };

        await client.SendMailAsync(message);
        logger.LogInformation("Email notification sent for appointment {AppointmentId}.", appointment.Id);
        return true;
    }

    private async Task<bool> SendSmsAsync(Appointment appointment, string body)
    {
        var accountSid = config["Notifications:Twilio:AccountSid"];
        var authToken = config["Notifications:Twilio:AuthToken"];
        var fromNumber = config["Notifications:Twilio:FromNumber"];

        if (string.IsNullOrWhiteSpace(accountSid)
            || string.IsNullOrWhiteSpace(authToken)
            || string.IsNullOrWhiteSpace(fromNumber))
        {
            logger.LogInformation("Twilio settings are missing. SMS notification was not sent for appointment {AppointmentId}.", appointment.Id);
            return false;
        }

        var client = httpClientFactory.CreateClient();
        var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"https://api.twilio.com/2010-04-01/Accounts/{accountSid}/Messages.json")
        {
            Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["To"] = appointment.ClientPhone!,
                ["From"] = fromNumber,
                ["Body"] = body
            })
        };

        var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{accountSid}:{authToken}"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);

        var response = await client.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var responseBody = await response.Content.ReadAsStringAsync();
            logger.LogWarning(
                "Twilio SMS failed for appointment {AppointmentId} with status {StatusCode}: {ResponseBody}",
                appointment.Id,
                response.StatusCode,
                responseBody);
            return false;
        }

        logger.LogInformation("Twilio SMS notification sent for appointment {AppointmentId}.", appointment.Id);
        return true;
    }

    private static string BuildAppointmentStatusEmail(
        Appointment appointment,
        string statusLabel,
        string headline,
        string preheader,
        string intro,
        string guidanceTitle,
        string guidanceBody)
    {
        var template = LoadTemplate(AppointmentStatusTemplatePath);
        var appointmentDate = appointment.AppointmentDate.ToString("dddd, MMMM d, yyyy", CultureInfo.GetCultureInfo("en-CA"));
        var startTime = appointment.StartTime.ToString("h:mm tt", CultureInfo.InvariantCulture);
        var endTime = appointment.EndTime.ToString("h:mm tt", CultureInfo.InvariantCulture);
        var totalDuration = appointment.Services.Sum(service => service.DurationInMinutes);
        var totalPrice = appointment.Services.Sum(service => service.Price);

        var values = new Dictionary<string, string>
        {
            ["Preheader"] = Encode(preheader),
            ["StatusLabel"] = Encode(statusLabel),
            ["Headline"] = Encode(headline),
            ["Intro"] = Encode(intro),
            ["ClientName"] = Encode(appointment.ClientName),
            ["AppointmentDate"] = Encode(appointmentDate),
            ["StartTime"] = Encode(startTime),
            ["EndTime"] = Encode(endTime),
            ["ServicesRows"] = BuildServicesRows(appointment),
            ["TotalDuration"] = Encode($"{totalDuration} min"),
            ["TotalPrice"] = Encode(FormatMoney(totalPrice)),
            ["NotesSection"] = BuildNotesSection(appointment),
            ["GuidanceTitle"] = Encode(guidanceTitle),
            ["GuidanceBody"] = Encode(guidanceBody)
        };

        foreach (var (key, value) in values)
        {
            template = template.Replace($"{{{{{key}}}}}", value, StringComparison.Ordinal);
        }

        return template;
    }

    private static string LoadTemplate(string relativePath)
    {
        var baseDirectoryPath = Path.Combine(AppContext.BaseDirectory, relativePath);
        if (File.Exists(baseDirectoryPath))
        {
            return File.ReadAllText(baseDirectoryPath);
        }

        var projectPath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);
        if (File.Exists(projectPath))
        {
            return File.ReadAllText(projectPath);
        }

        throw new FileNotFoundException($"Email template file was not found: {relativePath}");
    }

    private static string BuildServicesRows(Appointment appointment)
    {
        if (appointment.Services.Count == 0)
        {
            return """
              <tr>
                <td colspan="2" style="padding:14px 0; color:#6b7280; font-size:14px; border-bottom:1px solid #fce7f3;">No services listed.</td>
              </tr>
              """;
        }

        return string.Join("", appointment.Services.Select(service => $$"""
          <tr>
            <td style="padding:14px 0; border-bottom:1px solid #fce7f3;">
              <div style="color:#111827; font-size:15px; font-weight:800;">{{Encode(service.Name)}}</div>
              <div style="margin-top:4px; color:#6b7280; font-size:13px;">{{service.DurationInMinutes}} minutes</div>
            </td>
            <td align="right" style="padding:14px 0; border-bottom:1px solid #fce7f3; color:#111827; font-size:15px; font-weight:800;">{{Encode(FormatMoney(service.Price))}}</td>
          </tr>
          """));
    }

    private static string BuildNotesSection(Appointment appointment)
    {
        if (string.IsNullOrWhiteSpace(appointment.Notes))
        {
            return "";
        }

        return $$"""
          <tr>
            <td style="padding: 18px 0 0;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #9f1239;">Notes</div>
              <div style="margin-top: 8px; padding: 14px 16px; border-radius: 12px; background: #fff7f9; color: #4b5563; font-size: 14px; line-height: 1.6;">
                {{Encode(appointment.Notes)}}
              </div>
            </td>
          </tr>
          """;
    }

    private static string FormatMoney(decimal value)
    {
        return value.ToString("C", CultureInfo.GetCultureInfo("en-CA"));
    }

    private static string Encode(string? value)
    {
        return WebUtility.HtmlEncode(value ?? "");
    }
}
