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

    public ICollection<Photo> Photos { get; set; } = [];

    public ICollection<Appointment> Appointments { get; set; } = [];

    public ICollection<Review> Reviews { get; set; } = [];

}
