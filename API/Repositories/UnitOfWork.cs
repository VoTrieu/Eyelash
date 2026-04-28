using System;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using API.Data;
using AutoMapper;


namespace API.Repositories;

public class UnitOfWork(AppDbContext context, IMapper mapper) : IUnitOfWork
{
    private IServicesRepository? _servicesRepository;
    private IAppointmentsRepository? _appointmentsRepository;
    public IServicesRepository ServicesRepository => _servicesRepository ??= new ServicesRepository(context, mapper);
    public IAppointmentsRepository AppointmentsRepository => _appointmentsRepository ??= new AppointmentsRepository(context, mapper);

    public async Task<bool> CompleteAsync()
    {
        try
        {
            return await context.SaveChangesAsync() > 0;
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while saving changes to the database.", ex);
        }
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}
