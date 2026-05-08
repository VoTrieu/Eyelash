using API.Entities;

namespace API.Interfaces;

public interface IAppointmentNotificationService
{
    Task<bool> SendConfirmationAsync(Appointment appointment, AppointmentSettings settings);
    Task<bool> SendRejectionAsync(Appointment appointment, AppointmentSettings settings);
}
