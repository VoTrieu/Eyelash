using System;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser: IdentityUser
{
    public required string DisplayName { get; set; }
    public string? ImageUrl { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    
    [JsonIgnore]
    public ICollection<Photo> Photos { get; set; } = [];
    [JsonIgnore]
    public ICollection<Appointment> Appointments { get; set; } = [];
    [JsonIgnore]
    public ICollection<Review> Reviews { get; set; } = [];

    [JsonIgnore]
    public ICollection<Service> FavoriteServices { get; set; } = [];

}
