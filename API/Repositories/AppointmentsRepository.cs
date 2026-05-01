using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class AppointmentsRepository(AppDbContext context, IMapper mapper) : IAppointmentsRepository
{
    public void AddAppointment(Appointment appointment)
    {
        context.Appointments.Add(appointment);
    }

    public void UpdateAppointment(Appointment appointment)
    {
        context.Appointments.Update(appointment);
    }

    public async Task<Appointment?> GetAppointmentEntityByIdAsync(int appointmentId)
    {
        return await context.Appointments
            .Include(a => a.Services)
            .Include(a => a.Photos)
            .FirstOrDefaultAsync(a => a.Id == appointmentId);
    }

    public async Task<AppointmentDto?> GetAppointmentByIdAsync(int appointmentId)
    {
        return await context.Appointments
            .Where(a => a.Id == appointmentId)
            .ProjectTo<AppointmentDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    public Task<PaginatedResult<AppointmentDto>> GetAppointmentsAsync(AppointmentParams appointmentParams)
    {
        var query = context.Appointments.AsQueryable();

        if (!string.IsNullOrWhiteSpace(appointmentParams.Search))
        {
            var search = appointmentParams.Search.Trim();
            query = query.Where(a =>
                EF.Functions.Like(a.ClientName, $"%{search}%") ||
                EF.Functions.Like(a.ClientEmail, $"%{search}%") ||
                (a.ClientPhone != null && EF.Functions.Like(a.ClientPhone, $"%{search}%")) ||
                a.Services.Any(s => EF.Functions.Like(s.Name, $"%{search}%")));
        }

        if (!string.IsNullOrWhiteSpace(appointmentParams.Status)
            && Enum.TryParse<AppointmentStatus>(appointmentParams.Status, true, out var status))
        {
            query = query.Where(a => a.Status == status);
        }

        if (appointmentParams.FromDate.HasValue)
        {
            query = query.Where(a => a.AppointmentDate >= appointmentParams.FromDate.Value);
        }

        if (appointmentParams.ToDate.HasValue)
        {
            query = query.Where(a => a.AppointmentDate <= appointmentParams.ToDate.Value);
        }

        var descending = string.Equals(appointmentParams.SortDirection, "desc", StringComparison.OrdinalIgnoreCase);

        query = appointmentParams.SortBy.ToLowerInvariant() switch
        {
            "client" or "clientname" => descending ? query.OrderByDescending(a => a.ClientName) : query.OrderBy(a => a.ClientName),
            "status" => descending ? query.OrderByDescending(a => a.Status) : query.OrderBy(a => a.Status),
            "created" => descending ? query.OrderByDescending(a => a.Created) : query.OrderBy(a => a.Created),
            _ => descending
                ? query.OrderByDescending(a => a.AppointmentDate).ThenByDescending(a => a.StartTime)
                : query.OrderBy(a => a.AppointmentDate).ThenBy(a => a.StartTime)
        };

        var dtoQuery = query.ProjectTo<AppointmentDto>(mapper.ConfigurationProvider);

        return PaginationHelper.CreatePaginatedResultAsync(
            dtoQuery,
            appointmentParams.PageNumber,
            appointmentParams.PageSize);
    }

    public async Task<AppointmentSettings> GetSettingsAsync()
    {
        var settings = await context.AppointmentSettings.FirstOrDefaultAsync(s => s.Id == 1);
        if (settings != null) return settings;

        settings = new AppointmentSettings { Id = 1 };
        context.AppointmentSettings.Add(settings);
        return settings;
    }

    public Task<IReadOnlyList<Appointment>> GetAppointmentForDateAsync(DateOnly date)
    {
        throw new NotImplementedException();
    }
}
