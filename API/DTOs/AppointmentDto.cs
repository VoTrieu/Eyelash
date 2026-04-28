using System;

namespace API.DTOs;

public class AppointmentDto
{
    public int Id { get; set; }

    public DateOnly AppointmentDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }

    public string? Notes { get; set; }
    public string Status { get; set; } = "";
    public string ClientName { get; set; } = "";
    public string ClientEmail { get; set; } = "";
    public string? ClientPhone { get; set; }
    public bool ConfirmationNotificationSent { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime Created { get; set; }

    public List<ServiceDto> Services { get; set; } = [];
    public List<PhotoDto> Photos { get; set; } = [];
}
