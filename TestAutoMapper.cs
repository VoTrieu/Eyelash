using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using System;

public class Program
{
    public static void Main()
    {
        var services = new ServiceCollection();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
    }
}
