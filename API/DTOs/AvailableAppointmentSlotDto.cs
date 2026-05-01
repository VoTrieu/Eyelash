using System;

namespace API.DTOs;

public class AvailableAppointmentSlotDto
{
    public TimeOnly StarTime { get; set; }
    public TimeOnly EndTime { get; set; }
}
