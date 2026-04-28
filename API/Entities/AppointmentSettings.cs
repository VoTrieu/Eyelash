namespace API.Entities;

public class AppointmentSettings
{
    public int Id { get; set; }
    public bool SendConfirmationNotifications { get; set; } = true;
    public bool SendSms { get; set; } = false;
    public bool SendEmail { get; set; } = true;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
