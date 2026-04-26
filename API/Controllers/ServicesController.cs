using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ServicesController(IUnitOfWork uow): BaseApiController
{
    //Create Service
    [HttpPost]
    public async Task<ActionResult> CreateService([FromForm] CreateServiceDto dto)
    {
        var service = new Service
        {
            Name = dto.Name,
            Price = dto.Price,
            Description = dto.Description,
            DurationInMinutes = dto.DurationInMinutes
        };

        // ✅ Handle uploaded files
        if (dto.Photos.Any())
        {
            var photos = new List<Photo>();

            foreach (var file in dto.Photos)
            {
                // 🔥 TEMP: save locally (you can switch to Cloudinary later)
                var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine("wwwroot/images", fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                photos.Add(new Photo
                {
                    Url = $"/images/{fileName}",
                    IsMain = photos.Count == 0 // first = main
                });
            }

            service.Photos = photos;
        }

        uow.ServicesRepository.AddService(service);

        if (await uow.CompleteAsync())
            return Ok();

        return BadRequest("Failed to create service");
            
    }

}
