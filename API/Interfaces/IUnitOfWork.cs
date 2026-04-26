using System;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IServicesRepository ServicesRepository { get; }

    Task<bool> CompleteAsync();
    bool HasChanges();

}
