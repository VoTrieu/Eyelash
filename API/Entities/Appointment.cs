using System;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Appointment
{
    public int Id { get; set; }
    public DateOnly AppointmentDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string? Notes { get; set; }  
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public string ClientName { get; set; } = "";
    public string ClientEmail { get; set; } = "";
    public string? ClientPhone { get; set; }
    public bool ConfirmationNotificationSent { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;

    public string? ClientId { get; set; }
     [JsonIgnore]
    public AppUser? Client { get; set; }
    
    [JsonIgnore]
    public Review? Review { get; set; }
    

    [JsonIgnore]
    public ICollection<Service> Services { get; set; } = [];

    public ICollection<Photo> Photos { get; set; } = [];
}

public enum AppointmentStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed
}
