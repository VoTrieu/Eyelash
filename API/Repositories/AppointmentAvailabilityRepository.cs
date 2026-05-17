using System;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class AppointmentAvailabilityRepository(AppDbContext context, IMapper mapper) : IAppointmentAvailabilityRepository
{
    public void AddAvailablityBlock(AppointmentAvailabilityBlock block)
    {
        context.AppointmentAvailabilityBlocks.Add(block);
    }

    public void UpdateAvailabilityBlock(AppointmentAvailabilityBlock block)
    {
        context.AppointmentAvailabilityBlocks.Update(block);
    }

    public void DeleteAvailablityBlock(AppointmentAvailabilityBlock block)
    {
        context.AppointmentAvailabilityBlocks.Remove(block);
    }

    public async Task<PaginatedResult<AppointmentAvailabilityBlockDto>> GetAllAvailabilityBlocksAsync(AppointmentAvailabilityParams appointmentAvailabilityParams)
    {
        var query = context.AppointmentAvailabilityBlocks.AsQueryable();
        var descending = appointmentAvailabilityParams.SortDirection.Equals("desc", StringComparison.OrdinalIgnoreCase);

        if (appointmentAvailabilityParams.FromDate.HasValue)
        {
            query = query.Where(a => a.Date >= appointmentAvailabilityParams.FromDate.Value);
        }

        if (appointmentAvailabilityParams.ToDate.HasValue)
        {
            query = query.Where(a => a.Date <= appointmentAvailabilityParams.ToDate.Value);
        }

        query = appointmentAvailabilityParams.SortBy?.ToLowerInvariant() switch
        {
            "date" => descending ? query.OrderByDescending(a => a.Date).ThenByDescending(a => a.StartTime) : query.OrderBy(a => a.Date).ThenBy(a => a.StartTime),
            "type" => descending ? query.OrderByDescending(a => a.Type) : query.OrderBy(a => a.Type),
            _ => query.OrderBy(a => a.Id)
        };

        var dtoQuery = query.ProjectTo<AppointmentAvailabilityBlockDto>(mapper.ConfigurationProvider);

        return await PaginationHelper.CreatePaginatedResultAsync(
            dtoQuery, 
            appointmentAvailabilityParams.PageNumber, 
            appointmentAvailabilityParams.PageSize);
    }

    public async Task<AppointmentAvailabilityBlock?> GetAvailabilityBlockEntityByIdAsyns(int Id)
    {
        return await context.AppointmentAvailabilityBlocks.FirstOrDefaultAsync(a => a.Id == Id);         
    }

    public async Task<IReadOnlyList<AppointmentAvailabilityBlock>> GetAvailabilityBlocksForDateAsync(DateOnly date)
    {
        return await context.AppointmentAvailabilityBlocks.Where(a => a.Date == date).ToListAsync();
    }

    public async Task<IReadOnlyList<AppointmentAvailabilityBlockDto>> GetAvailabilityBlocksAsync(DateOnly? date)
    {
        if (!date.HasValue)
        {
            date = DateOnly.FromDateTime(DateTime.Today);
        }

        return await context.AppointmentAvailabilityBlocks
            .Where(a => a.Date == date.Value)
            .ProjectTo<AppointmentAvailabilityBlockDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<AvailableAppointmentSlotDto>> GetAvailableAppointmentSlotsAsync(DateOnly date, IReadOnlyList<int> serviceIds)
    {
        var services = await context.Services.Where(s => serviceIds.Contains(s.Id)).ToListAsync();
        
        if(services.Count != serviceIds.Distinct().Count())
        {
            return [];
        }

        var totalDuration = services.Sum(s => s.DurationInMinutes);

        var blocks = await context.AppointmentAvailabilityBlocks
            .Where(a => a.Date == date && a.IsActive)
            .ToListAsync();

        if(blocks.Any(b => b.Type == AvailabilityBlockType.Closed))
        {
            return [];
        }

        var workingWindows = blocks
        .Where(b => b.Type == AvailabilityBlockType.Working && b.StartTime.HasValue && b.EndTime.HasValue)
        .Select(b => new AvailableAppointmentSlotDto{ StartTime = b.StartTime!.Value, EndTime = b.EndTime!.Value })
        .ToList();
        
        if(workingWindows.Count == 0)
        {
            workingWindows.Add(new AvailableAppointmentSlotDto
            { 
                StartTime = new TimeOnly(9, 0), 
                EndTime = new TimeOnly(20, 0) 
            });
        }

        var blockRanges = blocks
            .Where(b => b.Type == AvailabilityBlockType.Blocked && b.StartTime.HasValue && b.EndTime.HasValue)
            .Select(b => new AvailableAppointmentSlotDto{ StartTime = b.StartTime!.Value, EndTime = b.EndTime!.Value })
            .ToList();

        var existingAppointments = await context.Appointments
            .Where(a => a.AppointmentDate == date && a.Status != AppointmentStatus.Cancelled)
            .Select(a => new AvailableAppointmentSlotDto
            {
                StartTime = a.StartTime,
                EndTime = a.EndTime
            })
            .ToListAsync();

        var unavailableRanges = blockRanges.Concat(existingAppointments)
            .OrderBy(r => r.StartTime)
            .ToList();
        
        // Logic to calculate available slots based on working windows and unavailable ranges
        // This is a complex logic that involves iterating through working windows and subtracting unavailable ranges
        // For simplicity, let's assume we have a helper method that does this calculation and returns available slots
        var availableSlots = CalculateAvailableSlots(workingWindows, unavailableRanges, totalDuration);


    return availableSlots;

    }

    private IReadOnlyList<AvailableAppointmentSlotDto> CalculateAvailableSlots(List<AvailableAppointmentSlotDto> workingWindows, List<AvailableAppointmentSlotDto> unavailableRanges, int totalDuration)
    {
        // This method would contain the logic to calculate available appointment slots based on the working windows, unavailable ranges, and total duration of the services.
        // The implementation would involve iterating through the working windows and checking for gaps that are long enough to accommodate the total duration, while also ensuring that these gaps do not overlap with any of the unavailable ranges.
        // Due to the complexity of this logic, it is not implemented here, but it would return a list of AvailableAppointmentSlotDto representing the available time slots for booking appointments.
        var slotsStepMinutes = 30;
        var slots = new List<AvailableAppointmentSlotDto>();

        foreach (var window in workingWindows)
        {
            var slotStart = window.StartTime;
            while (slotStart.AddMinutes(totalDuration) <= window.EndTime)
            {
                var slotEnd = slotStart.AddMinutes(totalDuration);
                var overlapsUnavailable = unavailableRanges.Any(r => r.StartTime < slotEnd && r.EndTime > slotStart);
                if (!overlapsUnavailable)
                {
                    slots.Add(new AvailableAppointmentSlotDto { StartTime = slotStart, EndTime = slotEnd });
                }
                slotStart = slotStart.AddMinutes(slotsStepMinutes);
            }
        }
        return slots;  
    }
}
