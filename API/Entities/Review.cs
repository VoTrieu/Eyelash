using System;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Review
{
    public int Id { get; set; }
    public string ClientId { get; set; } = "";
    [JsonIgnore]
    public AppUser Client { get; set; } = null!;

    public byte Rating { get; set; } = 0;
    public string? Comment { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;

    public int AppointmentId { get; set; }
    [JsonIgnore]
    public Appointment Appointment { get; set; } = null!;

    public int ServiceId { get; set; }
    [JsonIgnore]
    public Service Service { get; set; } = null!;

    [JsonIgnore]
    public ICollection<Photo> Photos { get; set; } = [];
}
