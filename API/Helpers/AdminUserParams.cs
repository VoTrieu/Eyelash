namespace API.Helpers;

public class AdminUserParams : PagingParams
{
    public string? Search { get; set; }
    public string? Role { get; set; }
    public bool? IsActive { get; set; }
    public string SortBy { get; set; } = "created";
    public string SortDirection { get; set; } = "desc";
}
