using API.Entities;

namespace API.Interfaces;

public interface IAppointmentNotificationService
{
    Task<bool> SendConfirmationAsync(Appointment appointment, AppointmentSettings settings);
}
