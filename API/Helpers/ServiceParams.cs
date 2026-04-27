using System;
using Humanizer;

namespace API.Helpers;

public class ServiceParams: PagingParams
{
    public string? Search { get; set; }
    public bool? IsAvailable { get; set; }
    public string? SortBy { get; set; } = "name";
    public string? SortDirection { get; set; } = "asc";
    public bool IncludeAppointments { get; set; }
    public bool IncludeReviews { get; set; }
    public bool IncludeClients { get; set; }
}
