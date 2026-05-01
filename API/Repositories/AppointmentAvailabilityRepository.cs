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

        if (appointmentAvailabilityParams.FromDate.HasValue)
        {
            query = query.Where(a => a.Date >= appointmentAvailabilityParams.FromDate.Value);
        }

        if (appointmentAvailabilityParams.ToDate.HasValue)
        {
            query = query.Where(a => a.Date <= appointmentAvailabilityParams.ToDate.Value);
        }

        query = query.OrderBy(a => a.Date).OrderBy(a => a.StartTime);

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
}
