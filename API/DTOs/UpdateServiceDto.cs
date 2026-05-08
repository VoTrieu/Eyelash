using System;

namespace API.DTOs;

public class UpdateServiceDto
{
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public string Description { get; set; } = "";
    public byte DurationInMinutes { get; set; }
    public bool IsAvailable { get; set; } = true;

    public List<IFormFile> Photos { get; set; } = [];
    public List<int> DeletePhotoIds { get; set; } = [];
}
