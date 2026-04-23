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
    
    [JsonIgnore]
    public List<Photo> Photos { get; set; } = [];

}
