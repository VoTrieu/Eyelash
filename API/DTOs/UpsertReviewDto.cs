using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpsertReviewDto
{
    [Required]
    public string ClientName { get; set; } = "";

    [EmailAddress]
    public string? ClientEmail { get; set; }

    [Range(1, 5)]
    public byte Rating { get; set; }

    public string? Comment { get; set; }

    [Required]
    public int ServiceId { get; set; }

    public int? AppointmentId { get; set; }
    public List<IFormFile> Photos { get; set; } = [];
    public List<int> DeletePhotoIds { get; set; } = [];
}
