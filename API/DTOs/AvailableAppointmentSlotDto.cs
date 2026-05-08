using System;

namespace API.DTOs;

public class AvailableAppointmentSlotDto
{
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}
