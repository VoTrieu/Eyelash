namespace API.DTOs;

public class AppointmentSettingsDto
{
    public bool SendConfirmationNotifications { get; set; }
    public bool SendSms { get; set; }
    public bool SendEmail { get; set; }
}
