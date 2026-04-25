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
    public DateTime Created { get; set; } = DateTime.UtcNow;

    public string ClientId { get; set; } = "";
     [JsonIgnore]
    public AppUser Client { get; set; } = null!;
    
    [JsonIgnore]
    public Review? Review { get; set; }
    

    [JsonIgnore]
    public ICollection<Service> Services { get; set; } = [];
}
