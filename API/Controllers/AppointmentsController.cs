using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Hubs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers;

public class AppointmentsController(
    IUnitOfWork uow,
    IWebHostEnvironment env,
    IHubContext<AppointmentHub> appointmentHub,
    IAppointmentNotificationService notificationService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<AppointmentDto>>> GetAppointments([FromQuery] AppointmentParams appointmentParams)
    {
        return await uow.AppointmentsRepository.GetAppointmentsAsync(appointmentParams);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppointmentDto>> GetAppointment(int id)
    {
        var appointment = await uow.AppointmentsRepository.GetAppointmentByIdAsync(id);

        if (appointment == null) return NotFound();

        return appointment;
    }

    [HttpPost]
    public async Task<ActionResult<AppointmentDto>> CreateAppointment([FromForm] CreateAppointmentDto dto)
    {
        var services = new List<Service>();

        foreach (var serviceId in dto.ServiceIds.Distinct())
        {
            var service = await uow.ServicesRepository.GetServiceEntityByIdAsync(serviceId);
            if (service == null || !service.IsAvailable) return BadRequest($"Service {serviceId} is not available.");

            services.Add(service);
        }

        if (services.Count == 0) return BadRequest("Select at least one service.");

        var startTime = dto.StartTime;
        var duration = services.Sum(s => s.DurationInMinutes);

        var appointment = new Appointment
        {
            AppointmentDate = dto.AppointmentDate,
            StartTime = startTime,
            EndTime = startTime.AddMinutes(duration),
            ClientName = dto.ClientName.Trim(),
            ClientEmail = dto.ClientEmail.Trim(),
            ClientPhone = dto.ClientPhone?.Trim(),
            Notes = dto.Notes?.Trim(),
            Services = services
        };

        if (dto.Photos.Any())
        {
            appointment.Photos = await SaveAppointmentPhotos(dto.Photos);
        }

        uow.AppointmentsRepository.AddAppointment(appointment);

        if (await uow.CompleteAsync())
        {
            var created = await uow.AppointmentsRepository.GetAppointmentByIdAsync(appointment.Id);
            await appointmentHub.Clients.All.SendAsync("AppointmentCreated", created);
            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, created);
        }

        return BadRequest("Failed to create appointment.");
    }

    [HttpPut("{id:int}/confirm")]
    public async Task<ActionResult<AppointmentDto>> ConfirmAppointment(int id)
    {
        var appointment = await uow.AppointmentsRepository.GetAppointmentEntityByIdAsync(id);
        if (appointment == null) return NotFound();

        appointment.Status = AppointmentStatus.Confirmed;
        appointment.ConfirmedAt = DateTime.UtcNow;

        var settings = await uow.AppointmentsRepository.GetSettingsAsync();
        appointment.ConfirmationNotificationSent = await notificationService.SendConfirmationAsync(appointment, settings);

        if (await uow.CompleteAsync())
        {
            var updated = await uow.AppointmentsRepository.GetAppointmentByIdAsync(id);
            await appointmentHub.Clients.All.SendAsync("AppointmentUpdated", updated);
            return Ok(updated);
        }

        return BadRequest("Failed to confirm appointment.");
    }

    [HttpPut("{id:int}/cancel")]
    public async Task<ActionResult<AppointmentDto>> CancelAppointment(int id)
    {
        return await SetStatus(id, AppointmentStatus.Cancelled);
    }

    [HttpPut("{id:int}/complete")]
    public async Task<ActionResult<AppointmentDto>> CompleteAppointment(int id)
    {
        return await SetStatus(id, AppointmentStatus.Completed);
    }

    [HttpGet("settings")]
    public async Task<ActionResult<AppointmentSettingsDto>> GetSettings()
    {
        var settings = await uow.AppointmentsRepository.GetSettingsAsync();
        await uow.CompleteAsync();

        return new AppointmentSettingsDto
        {
            SendConfirmationNotifications = settings.SendConfirmationNotifications,
            SendEmail = settings.SendEmail,
            SendSms = settings.SendSms
        };
    }

    [HttpPut("settings")]
    public async Task<ActionResult<AppointmentSettingsDto>> UpdateSettings(UpdateAppointmentSettingsDto dto)
    {
        var settings = await uow.AppointmentsRepository.GetSettingsAsync();
        settings.SendConfirmationNotifications = dto.SendConfirmationNotifications;
        settings.SendEmail = dto.SendEmail;
        settings.SendSms = dto.SendSms;
        settings.UpdatedAt = DateTime.UtcNow;

        if (!uow.HasChanges() || await uow.CompleteAsync())
        {
            var result = new AppointmentSettingsDto
            {
                SendConfirmationNotifications = settings.SendConfirmationNotifications,
                SendEmail = settings.SendEmail,
                SendSms = settings.SendSms
            };

            await appointmentHub.Clients.All.SendAsync("AppointmentSettingsUpdated", result);
            return Ok(result);
        }

        return BadRequest("Failed to update appointment settings.");
    }

    private async Task<ActionResult<AppointmentDto>> SetStatus(int id, AppointmentStatus status)
    {
        var appointment = await uow.AppointmentsRepository.GetAppointmentEntityByIdAsync(id);
        if (appointment == null) return NotFound();

        appointment.Status = status;

        if (await uow.CompleteAsync())
        {
            var updated = await uow.AppointmentsRepository.GetAppointmentByIdAsync(id);
            await appointmentHub.Clients.All.SendAsync("AppointmentUpdated", updated);
            return Ok(updated);
        }

        return BadRequest("Failed to update appointment.");
    }

    private async Task<List<Photo>> SaveAppointmentPhotos(IEnumerable<IFormFile> files)
    {
        var photos = new List<Photo>();
        var imagesPath = GetImagesPath();

        Directory.CreateDirectory(imagesPath);

        foreach (var file in files.Where(f => f.Length > 0))
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(imagesPath, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            photos.Add(new Photo
            {
                Url = $"/Images/{fileName}",
                IsMain = photos.Count == 0
            });
        }

        return photos;
    }

    private string GetImagesPath()
    {
        var webRoot = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        return Path.Combine(webRoot, "Images");
    }
}
