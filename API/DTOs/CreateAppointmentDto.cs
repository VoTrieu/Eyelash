using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateAppointmentDto
{
    [Required]
    public string ClientName { get; set; } = "";

    [Required]
    [EmailAddress]
    public string ClientEmail { get; set; } = "";

    public string? ClientPhone { get; set; }

    [Required]
    public DateOnly AppointmentDate { get; set; }

    [Required]
    public TimeOnly StartTime { get; set; }

    public string? Notes { get; set; }

    [MinLength(1)]
    public List<int> ServiceIds { get; set; } = [];

    public List<IFormFile> Photos { get; set; } = [];
}
