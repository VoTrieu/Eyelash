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

    public async Task<Service?> GetServiceEntityByIdAsync(int serviceId)
    {
        return await context.Services
            .Include(s => s.Photos)
            .FirstOrDefaultAsync(s => s.Id == serviceId);
    }

    public Task<PaginatedResult<ServiceDto>> GetAllServicesAsync(ServiceParams serviceParams)
    {
        var query = context.Services
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(serviceParams.Search))
        {
            var search = serviceParams.Search.Trim();
            query = query.Where(s =>
                EF.Functions.Like(s.Name, $"%{search}%") ||
                EF.Functions.Like(s.Description, $"%{search}%"));
        }

        if (serviceParams.IsAvailable.HasValue)
        {
            query = query.Where(s => s.IsAvailable == serviceParams.IsAvailable.Value);
        }

        var descending = string.Equals(serviceParams.SortDirection, "desc", StringComparison.OrdinalIgnoreCase);

        query = serviceParams.SortBy?.ToLowerInvariant() switch
        {
            "price" => descending ? query.OrderByDescending(s => s.Price) : query.OrderBy(s => s.Price),
            "duration" or "durationinminutes" => descending
                ? query.OrderByDescending(s => s.DurationInMinutes)
                : query.OrderBy(s => s.DurationInMinutes),
            "created" => descending ? query.OrderByDescending(s => s.Created) : query.OrderBy(s => s.Created),
            "availability" or "isavailable" => descending
                ? query.OrderByDescending(s => s.IsAvailable)
                : query.OrderBy(s => s.IsAvailable),
            _ => descending ? query.OrderByDescending(s => s.Name) : query.OrderBy(s => s.Name)
        };

        var dtoQuery = query.ProjectTo<ServiceDto>(mapper.ConfigurationProvider);

        return PaginationHelper.CreatePaginatedResultAsync(dtoQuery, 
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
}
