namespace API.DTOs;

public class AdminUserDto
{
    public required string Id { get; set; }
    public required string DisplayName { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ImageUrl { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }
    public bool IsActive { get; set; }
    public IReadOnlyList<string> Roles { get; set; } = [];
}
