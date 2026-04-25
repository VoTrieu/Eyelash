using System;
using System.Collections;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Service
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; } = 0;
    public string Description { get; set; } = ""; 
    public byte DurationInMinutes { get; set; } = 0;
    public bool IsAvailable { get; set; } = true;  
    public DateTime Created { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public ICollection<Photo> Photos { get; set; } = [];

    [JsonIgnore]
    public ICollection<Appointment> Appointments { get; set; } = [];

    [JsonIgnore]
    public ICollection<Review> Reviews { get; set; } = [];

    [JsonIgnore]
    public ICollection<AppUser> Clients { get; set; } = [];

}
