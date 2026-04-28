using System;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IServicesRepository ServicesRepository { get; }
    IAppointmentsRepository AppointmentsRepository { get; }

    Task<bool> CompleteAsync();
    bool HasChanges();

}
