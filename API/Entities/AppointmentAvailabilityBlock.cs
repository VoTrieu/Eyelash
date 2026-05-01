using System;

namespace API.Entities;

public class AppointmentAvailabilityBlock
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }

    public AvailabilityBlockType Type { get; set; } = AvailabilityBlockType.Blocked;

    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;


}

public enum AvailabilityBlockType
{
    Working,
    Blocked,
    Closed
}
