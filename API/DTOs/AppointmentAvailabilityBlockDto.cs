using System;

namespace API.DTOs;

public class AppointmentAvailabilityBlockDto
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }

    public string? Notes { get; set; }
    public string Type {get; set;} = "";
    public bool IsActive { get; set; } 
}
