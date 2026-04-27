using System;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IServicesRepository
{
    void AddService(Service service);
    void UpdateService(Service service);
    void DeleteService(Service service);
    Task<Service?> GetServiceEntityByIdAsync(int serviceId);
    Task<ServiceDetailDto?> GetServiceByIdAsync(int serviceId);
    Task<PaginatedResult<ServiceDto>> GetAllServicesAsync(ServiceParams serviceParams);
    Task<IReadOnlyList<ServiceDetailDto>> GetServicesByClientIdAsync(string clientId);
}
   
