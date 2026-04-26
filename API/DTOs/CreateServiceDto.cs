using System;

namespace API.DTOs;

public class CreateServiceDto
{
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public string Description { get; set; } = "";
    public byte DurationInMinutes { get; set; }

    public List<IFormFile> Photos { get; set; } = new();

}
