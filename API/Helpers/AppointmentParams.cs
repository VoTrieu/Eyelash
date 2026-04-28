namespace API.Helpers;

public class AppointmentParams : PagingParams
{
    public string? Search { get; set; }
    public string? Status { get; set; }
    public DateOnly? FromDate { get; set; }
    public DateOnly? ToDate { get; set; }
    public string SortBy { get; set; } = "appointmentDate";
    public string SortDirection { get; set; } = "asc";
}
