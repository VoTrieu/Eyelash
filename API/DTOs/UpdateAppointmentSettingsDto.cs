namespace API.DTOs;

public class UpdateAppointmentSettingsDto
{
    public bool SendConfirmationNotifications { get; set; }
    public bool SendSms { get; set; }
    public bool SendEmail { get; set; }
}
