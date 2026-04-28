using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IAppointmentsRepository
{
    void AddAppointment(Appointment appointment);
    void UpdateAppointment(Appointment appointment);
    Task<Appointment?> GetAppointmentEntityByIdAsync(int appointmentId);
    Task<AppointmentDto?> GetAppointmentByIdAsync(int appointmentId);
    Task<PaginatedResult<AppointmentDto>> GetAppointmentsAsync(AppointmentParams appointmentParams);
    Task<AppointmentSettings> GetSettingsAsync();
}
