using System;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ServicesController(IUnitOfWork uow, IWebHostEnvironment env): BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<ServiceDto>>> GetServices([FromQuery] ServiceParams serviceParams)
    {
        return await uow.ServicesRepository.GetAllServicesAsync(serviceParams);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ServiceDetailDto>> GetService(int id)
    {
        var service = await uow.ServicesRepository.GetServiceByIdAsync(id);

        if (service == null) return NotFound();

        return service;
    }

    [HttpGet("client/{clientId}")]
    public async Task<ActionResult<IReadOnlyList<ServiceDetailDto>>> GetServicesByClientId(string clientId)
    {
        return Ok(await uow.ServicesRepository.GetServicesByClientIdAsync(clientId));
    }

    //Create Service
    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost]
    public async Task<ActionResult<ServiceDetailDto>> CreateService([FromForm] CreateServiceDto dto)
    {
        var service = new Service
        {
            Name = dto.Name,
            Price = dto.Price,
            Description = dto.Description,
            DurationInMinutes = dto.DurationInMinutes,
            IsAvailable = dto.IsAvailable
        };

        if (dto.Photos.Any())
        {
            service.Photos = await SaveServicePhotos(dto.Photos, markFirstAsMain: true);
        }

        uow.ServicesRepository.AddService(service);

        if (await uow.CompleteAsync())
        {
            var createdService = await uow.ServicesRepository.GetServiceByIdAsync(service.Id);
            return CreatedAtAction(nameof(GetService), new { id = service.Id }, createdService);
        }

        return BadRequest("Failed to create service");
            
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ServiceDetailDto>> UpdateService(int id, [FromForm] UpdateServiceDto dto)
    {
        var service = await uow.ServicesRepository.GetServiceEntityByIdAsync(id);

        if (service == null) return NotFound();

        service.Name = dto.Name;
        service.Price = dto.Price;
        service.Description = dto.Description;
        service.DurationInMinutes = dto.DurationInMinutes;
        service.IsAvailable = dto.IsAvailable;

        var photosToDelete = service.Photos.Where(p => dto.DeletePhotoIds.Contains(p.Id)).ToList();
        foreach (var photo in photosToDelete){
            service.Photos.Remove(photo);
        }

        if (dto.Photos.Any())
        {
            var needsMainPhoto = !service.Photos.Any(p => p.IsMain);
            foreach (var photo in await SaveServicePhotos(dto.Photos, needsMainPhoto))
            {
                service.Photos.Add(photo);
            }
        }

        uow.ServicesRepository.UpdateService(service);

        if (!uow.HasChanges() || await uow.CompleteAsync())
        {
            DeleteLocalPhotos(photosToDelete);
            var updatedService = await uow.ServicesRepository.GetServiceByIdAsync(id);
            return Ok(updatedService);
        }

        return BadRequest("Failed to update service");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteService(int id)
    {
        var service = await uow.ServicesRepository.GetServiceEntityByIdAsync(id);

        if (service == null) return NotFound();

        var photos = service.Photos.ToList();
        uow.ServicesRepository.DeleteService(service);

        if (await uow.CompleteAsync())
        {
            DeleteLocalPhotos(photos);
            return NoContent();
        }

        return BadRequest("Failed to delete service");
    }

    [Authorize(Policy = "RequireAdminRole")]
    private async Task<List<Photo>> SaveServicePhotos(IEnumerable<IFormFile> files, bool markFirstAsMain)
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
                IsMain = markFirstAsMain && photos.Count == 0
            });
        }

        return photos;
    }

    private void DeleteLocalPhotos(IEnumerable<Photo> photos)
    {
        foreach (var photo in photos.Where(p => p.Url.StartsWith("/Images/", StringComparison.OrdinalIgnoreCase)))
        {
            var fileName = Path.GetFileName(photo.Url);
            var filePath = Path.Combine(GetImagesPath(), fileName);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }
    }

    private string GetImagesPath()
    {
        var webRoot = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        return Path.Combine(webRoot, "Images");
    }
}
