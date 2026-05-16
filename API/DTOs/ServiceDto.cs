using System;

namespace API.DTOs;

public class ServiceDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public string Description { get; set; } = "";
    public byte DurationInMinutes { get; set; }
    public bool IsAvailable { get; set; }
    public DateTime Created { get; set; }
    public string? MainPhotoUrl { get; set; }
    public List<PhotoDto> Photos { get; set; } = [];
}
