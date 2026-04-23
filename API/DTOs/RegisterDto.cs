using System;
using System.ComponentModel.DataAnnotations;
namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public string DisplayName { get; set; } = "";

    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    [Phone]
    public string PhoneNumber { get; set; } = "";

    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
    public string Password { get; set; } = "";

    [Required]
    public string Gender { get; set; } = "";

    [Required]
    public string Address { get; set; } = "";

    [Required]
    public DateTime? DateOfBirth { get; set; } = null;

}
