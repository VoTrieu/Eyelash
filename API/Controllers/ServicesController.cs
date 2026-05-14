using System;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ServicesController(IUnitOfWork uow, IPhotoService photoService): BaseApiController
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
            await DeleteCloudinaryPhotos(photosToDelete);
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
            await DeleteCloudinaryPhotos(photos);
            return NoContent();
        }

        return BadRequest("Failed to delete service");
    }

    private async Task<List<Photo>> SaveServicePhotos(IEnumerable<IFormFile> files, bool markFirstAsMain)
    {
        var photos = new List<Photo>();
        foreach (var file in files.Where(f => f.Length > 0))
        {
            var uploadResult = await photoService.UploadPhotoAsync(file);
            var photoUrl = uploadResult.SecureUrl?.AbsoluteUri ?? uploadResult.Url?.AbsoluteUri;

            if (uploadResult.Error != null || string.IsNullOrWhiteSpace(photoUrl))
            {
                throw new Exception(uploadResult.Error?.Message ?? "Cloudinary photo upload failed.");
            }

            photos.Add(new Photo
            {
                Url = photoUrl,
                PublicId = uploadResult.PublicId,
                IsMain = markFirstAsMain && photos.Count == 0
            });
        }

        return photos;
    }

    private async Task DeleteCloudinaryPhotos(IEnumerable<Photo> photos)
    {
        foreach (var photo in photos.Where(p => !string.IsNullOrWhiteSpace(p.PublicId)))
        {
            await photoService.DeletePhotoAsync(photo.PublicId!);
        }
    }
}
