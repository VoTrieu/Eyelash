using System;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Review
{
    public int Id { get; set; }
    public string? ClientId { get; set; }
    [JsonIgnore]
    public AppUser? Client { get; set; }

    public byte Rating { get; set; } = 0;
    public string? Comment { get; set; }
    public string ClientName { get; set; } = "";
    public string? ClientEmail { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public bool IsPublished { get; set; }

    public int? AppointmentId { get; set; }
    [JsonIgnore]
    public Appointment? Appointment { get; set; }

    public int ServiceId { get; set; }
    [JsonIgnore]
    public Service Service { get; set; } = null!;

    [JsonIgnore]
    public ICollection<Photo> Photos { get; set; } = [];
}
