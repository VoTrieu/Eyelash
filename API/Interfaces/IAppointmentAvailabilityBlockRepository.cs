using System;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IAppointmentAvailabilityRepository
{
    void AddAvailablityBlock(AppointmentAvailabilityBlock block);
    void DeleteAvailablityBlock(AppointmentAvailabilityBlock block);

    void UpdateAvailabilityBlock(AppointmentAvailabilityBlock block);
    Task<AppointmentAvailabilityBlock?> GetAvailabilityBlockEntityByIdAsyns(int Id);
    Task<IReadOnlyList<AppointmentAvailabilityBlock>> GetAvailabilityBlocksForDateAsync(DateOnly date);
    Task<PaginatedResult<AppointmentAvailabilityBlockDto>> GetAllAvailabilityBlocksAsync(AppointmentAvailabilityParams appointmentAvailabilityParams);

    Task<IReadOnlyList<AppointmentAvailabilityBlockDto>> GetAvailabilityBlocksAsync(DateOnly? date);
    Task<IReadOnlyList<AvailableAppointmentSlotDto>> GetAvailableAppointmentSlotsAsync(DateOnly date, 
        IReadOnlyList<int> serviceIds);
}
