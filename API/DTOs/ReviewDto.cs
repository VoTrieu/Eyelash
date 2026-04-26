using System;

namespace API.DTOs;

public class ReviewDto
{
    public int Id { get; set; }
    public byte Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime Created { get; set; }

    public string DisplayName { get; set; } = "";

    public List<PhotoDto> Photos { get; set; } = [];

}
