using System;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IServicesRepository ServicesRepository { get; }
    IAppointmentsRepository AppointmentsRepository { get; }

    IAppointmentAvailabilityRepository AppointmentAvailabilityRepository { get; }
    
    Task<bool> CompleteAsync();
    bool HasChanges();

}
