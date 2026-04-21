using System;

namespace API.DTOs;

public class SeedUserDto
{
     public required string Id { get; set; }
    public required string Email { get; set; }
    public string? DateOfBirth { get; set; }
    public string? ImageUrl { get; set; }
    public required string DisplayName { get; set; }
    public string? Created { get; set; }
    public string? LastActive { get; set; }
    public required string Gender { get; set; }
    public string? Description { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }

}
