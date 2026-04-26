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

public class ServicesRepository(AppDbContext context, IMapper mapper) : IServicesRepository
{
    public void AddService(Service service)
    {
        context.Services.Add(service);
    }

    public void DeleteService(Service service)
    {
        context.Services.Remove(service);
    }

    public Task<PaginatedResult<ServiceDto>> GetAllServicesAsync(ServiceParams serviceParams)
    {
        var query = context.Services
            .OrderBy(s => s.Name)
            .ProjectTo<ServiceDto>(mapper.ConfigurationProvider)
            .AsQueryable();

        return PaginationHelper.CreatePaginatedResultAsync(query, 
            serviceParams.PageNumber, serviceParams.PageSize);
    }

    public async Task<ServiceDetailDto?> GetServiceByIdAsync(int serviceId)
    {
        return await context.Services
            .Where(s => s.Id == serviceId)
            .ProjectTo<ServiceDetailDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

    }

    public async Task<IReadOnlyList<ServiceDetailDto>> GetServicesByClientIdAsync(string clientId)
    {
        return await context.Services
            .Where(s => s.Appointments.Any(a => a.Client.Id == clientId))
            .ProjectTo<ServiceDetailDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }


    public void UpdateService(Service service)
    {
        context.Services.Update(service);
    }

    // private IQueryable<ServiceDto> BuildServicesQuery(ServiceParams serviceParams)
    // {
    //     var query = context.Services.Include(s => s.Photos).AsQueryable();

    //     if(serviceParams.IncludeAppointments)
    //     {
    //         query = query.Include(s => s.Appointments);
    //     }

    //     if(serviceParams.IncludeReviews)
    //     {
    //         query = query.Include(s => s.Reviews);
    //     }

    //     if(serviceParams.IncludeClients)
    //     {
    //         query = query
    //             .Include(s => s.Appointments)
    //             .ThenInclude(a => a.Client);  
    //     }

    //     query = (IQueryable<Service>)query.ProjectTo<ServiceDto>(mapper.ConfigurationProvider);


    //     return query.AsSplitQuery();
    // }
}
