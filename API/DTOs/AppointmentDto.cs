using System;

namespace API.DTOs;

public class AppointmentDto
{
    public int Id { get; set; }

    public DateOnly AppointmentDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }

    public string? Notes { get; set; }

    public List<ServiceDto> Services { get; set; } = [];
}
