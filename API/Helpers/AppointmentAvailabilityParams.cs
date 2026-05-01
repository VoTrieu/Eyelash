using System;

namespace API.Helpers;

public class AppointmentAvailabilityParams: PagingParams
{
    public DateOnly? FromDate { get; set; }
    public DateOnly? ToDate { get; set; }
    public string SortBy { get; set; } = "Type";
    public string SortDirection { get; set; } = "asc";

}