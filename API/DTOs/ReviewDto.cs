using System;

namespace API.DTOs;

public class ReviewDto
{
    public int Id { get; set; }
    public byte Rating { get; set; }
    public string? Comment { get; set; }
    public string ClientName { get; set; } = "";
    public string? ClientEmail { get; set; }
    public DateTime Created { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; } = "";
    public int? AppointmentId { get; set; }
    public string DisplayName { get; set; } = "";

    public List<PhotoDto> Photos { get; set; } = [];

}
