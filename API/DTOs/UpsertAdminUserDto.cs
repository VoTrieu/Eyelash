using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpsertAdminUserDto
{
    [Required]
    public string DisplayName { get; set; } = "";

    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Phone]
    public string? PhoneNumber { get; set; }

    public string? Password { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public bool IsActive { get; set; } = true;
    public List<string> Roles { get; set; } = [];
}
