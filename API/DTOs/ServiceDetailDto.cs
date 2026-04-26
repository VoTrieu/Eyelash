using System;

namespace API.DTOs;

public class ServiceDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public string Description { get; set; } = "";
    public byte DurationInMinutes { get; set; }

    public List<PhotoDto> Photos { get; set; } = [];
    public List<ReviewDto> Reviews { get; set; } = [];
}