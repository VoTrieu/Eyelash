using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpsertAppointmentAvailabilityBlockDto
{   
    [Required]
    public DateOnly Date {get; set;}
    public TimeOnly? StartTime {get; set;}
    public TimeOnly? EndTime {get; set;}
    [Required]
    public string Type {get; set;} = "Blocked";
    public string? Notes {get; set;}
    public bool IsActive {get; set;} = true;


}
