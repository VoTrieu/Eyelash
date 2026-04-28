using API.Entities;
using API.Interfaces;
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
    public async Task<bool> SendConfirmationAsync(Appointment appointment, AppointmentSettings settings)
    {
        if (!settings.SendConfirmationNotifications)
        {
            logger.LogInformation("Appointment confirmation notifications are disabled.");
            return false;
        }

        var sent = false;

        if (settings.SendEmail && !string.IsNullOrWhiteSpace(appointment.ClientEmail))
        {
            sent = await SendEmailAsync(appointment) || sent;
        }

        if (settings.SendSms && !string.IsNullOrWhiteSpace(appointment.ClientPhone))
        {
            sent = await SendSmsAsync(appointment) || sent;
        }

        return sent;
    }

    private async Task<bool> SendEmailAsync(Appointment appointment)
    {
        var host = config["Notifications:Smtp:Host"];
        var from = config["Notifications:Smtp:From"];

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(from))
        {
            logger.LogInformation("SMTP settings are missing. Email confirmation was not sent for appointment {AppointmentId}.", appointment.Id);
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
            Subject = "Your appointment is confirmed",
            Body = BuildConfirmationMessage(appointment)
        };

        await client.SendMailAsync(message);
        logger.LogInformation("Email confirmation sent for appointment {AppointmentId}.", appointment.Id);
        return true;
    }

    private async Task<bool> SendSmsAsync(Appointment appointment)
    {
        var accountSid = config["Notifications:Twilio:AccountSid"];
        var authToken = config["Notifications:Twilio:AuthToken"];
        var fromNumber = config["Notifications:Twilio:FromNumber"];

        if (string.IsNullOrWhiteSpace(accountSid)
            || string.IsNullOrWhiteSpace(authToken)
            || string.IsNullOrWhiteSpace(fromNumber))
        {
            logger.LogInformation("Twilio settings are missing. SMS confirmation was not sent for appointment {AppointmentId}.", appointment.Id);
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
                ["Body"] = BuildConfirmationMessage(appointment)
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

        logger.LogInformation("Twilio SMS confirmation sent for appointment {AppointmentId}.", appointment.Id);
        return true;
    }

    private static string BuildConfirmationMessage(Appointment appointment)
    {
        return $"Hi {appointment.ClientName}, your appointment is confirmed for {appointment.AppointmentDate:yyyy-MM-dd} at {appointment.StartTime:HH\\:mm}.";
    }
}
