using System;

namespace API.Helpers;

public class PagingParams
{
    public int PageNumber { get; set; } = 1;
    private int MaxPageSize { get; set; } = 50;
    private int _PageSize { get; set; } = 10;

    public int PageSize
    {
        get => _PageSize;
        set => _PageSize = value > MaxPageSize ? MaxPageSize : value;
    }

}
