using System.Net;
using System.Net.Mail;
using System.Text;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace API.Controllers;

public class ContactController(
    IConfiguration config,
    ILogger<ContactController> logger) : BaseApiController
{
    private const string StudioTemplatePath = "EmailTemplates/ContactStudioNotification.html";
    private const string ClientTemplatePath = "EmailTemplates/ContactClientConfirmation.html";

    [HttpPost]
    [EnableRateLimiting("ContactPolicy")]
    public async Task<ActionResult> SendContactInquiry(ContactInquiryDto dto)
    {
        var studioRecipient = config["Notifications:Contact:StudioRecipient"];
        var from = config["Notifications:Smtp:From"];

        if (string.IsNullOrWhiteSpace(studioRecipient) || string.IsNullOrWhiteSpace(from))
        {
            logger.LogWarning("Contact email settings are missing.");
            return StatusCode(StatusCodes.Status500InternalServerError, "Contact email settings are missing.");
        }

        var name = dto.Name.Trim();
        var email = dto.Email.Trim();
        var phone = dto.Phone?.Trim();
        var message = dto.Message.Trim();

        await SendEmailAsync(
            to: studioRecipient,
            subject: $"New contact inquiry from {name}",
            body: BuildStudioEmail(name, email, phone, message),
            replyTo: email);

        await SendEmailAsync(
            to: email,
            subject: "We received your message",
            body: BuildClientConfirmationEmail(name));

        return Ok(new { message = "Contact inquiry sent." });
    }

    private async Task SendEmailAsync(string to, string subject, string body, string? replyTo = null)
    {
        var host = config["Notifications:Smtp:Host"];

        if (string.IsNullOrWhiteSpace(host))
        {
            throw new InvalidOperationException("SMTP host is missing.");
        }

        using var client = new SmtpClient(host)
        {
            Port = int.TryParse(config["Notifications:Smtp:Port"], out var port) ? port : 587,
            EnableSsl = bool.TryParse(config["Notifications:Smtp:EnableSsl"], out var enableSsl) && enableSsl
        };

        var username = config["Notifications:Smtp:Username"];
        var password = config["Notifications:Smtp:Password"];
        var from = config["Notifications:Smtp:From"]!;

        if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password))
        {
            client.Credentials = new NetworkCredential(username, password);
        }

        using var mailMessage = new MailMessage(from, to)
        {
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
            BodyEncoding = Encoding.UTF8,
            SubjectEncoding = Encoding.UTF8
        };

        if (!string.IsNullOrWhiteSpace(replyTo))
        {
            mailMessage.ReplyToList.Add(replyTo);
        }

        await client.SendMailAsync(mailMessage);
    }

    private static string BuildStudioEmail(string name, string email, string? phone, string message)
    {
        return ReplaceTemplateValues(LoadTemplate(StudioTemplatePath), new Dictionary<string, string>
        {
            ["Name"] = Encode(name),
            ["Email"] = Encode(email),
            ["Phone"] = Encode(string.IsNullOrWhiteSpace(phone) ? "Not provided" : phone),
            ["Message"] = Encode(message)
        });
    }

    private static string BuildClientConfirmationEmail(string name)
    {
        return ReplaceTemplateValues(LoadTemplate(ClientTemplatePath), new Dictionary<string, string>
        {
            ["Name"] = Encode(name)
        });
    }

    private static string LoadTemplate(string relativePath)
    {
        var baseDirectoryPath = Path.Combine(AppContext.BaseDirectory, relativePath);
        if (System.IO.File.Exists(baseDirectoryPath))
        {
            return System.IO.File.ReadAllText(baseDirectoryPath);
        }

        var projectPath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);
        if (System.IO.File.Exists(projectPath))
        {
            return System.IO.File.ReadAllText(projectPath);
        }

        throw new FileNotFoundException($"Email template file was not found: {relativePath}");
    }

    private static string ReplaceTemplateValues(string template, Dictionary<string, string> values)
    {
        foreach (var (key, value) in values)
        {
            template = template.Replace($"{{{{{key}}}}}", value, StringComparison.Ordinal);
        }

        return template;
    }

    private static string Encode(string? value)
    {
        return WebUtility.HtmlEncode(value ?? "");
    }
}
