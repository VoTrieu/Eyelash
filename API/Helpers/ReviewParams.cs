namespace API.Helpers;

public class ReviewParams : PagingParams
{
    public string? Search { get; set; }
    public int? ServiceId { get; set; }
    public byte? Rating { get; set; }
    public string SortBy { get; set; } = "created";
    public string SortDirection { get; set; } = "desc";
}
