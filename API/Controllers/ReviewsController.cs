using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class ReviewsController(
    AppDbContext context,
    IMapper mapper,
    IWebHostEnvironment env) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<ReviewDto>>> GetReviews(
        [FromQuery] ReviewParams reviewParams)
    {
        var query = context.Reviews.AsQueryable();

        if (!string.IsNullOrWhiteSpace(reviewParams.Search))
        {
            var search = reviewParams.Search.Trim();
            query = query.Where(r =>
                EF.Functions.Like(r.ClientName, $"%{search}%") ||
                (r.ClientEmail != null && EF.Functions.Like(r.ClientEmail, $"%{search}%")) ||
                (r.Comment != null && EF.Functions.Like(r.Comment, $"%{search}%")) ||
                EF.Functions.Like(r.Service.Name, $"%{search}%"));
        }

        if (reviewParams.ServiceId.HasValue)
        {
            query = query.Where(r => r.ServiceId == reviewParams.ServiceId.Value);
        }

        if (reviewParams.Rating.HasValue)
        {
            query = query.Where(r => r.Rating == reviewParams.Rating.Value);
        }

        query = ApplySorting(query, reviewParams.SortBy, reviewParams.SortDirection);

        var dtoQuery = query.ProjectTo<ReviewDto>(mapper.ConfigurationProvider);

        return await PaginationHelper.CreatePaginatedResultAsync(
            dtoQuery,
            reviewParams.PageNumber,
            reviewParams.PageSize);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ReviewDto>> GetReview(int id)
    {
        var review = await context.Reviews
            .Where(r => r.Id == id)
            .ProjectTo<ReviewDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (review == null) return NotFound();

        return review;
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromForm] UpsertReviewDto dto)
    {
        if (!await context.Services.AnyAsync(s => s.Id == dto.ServiceId))
        {
            return BadRequest("Selected service does not exist.");
        }

        if (dto.AppointmentId.HasValue &&
            !await context.Appointments.AnyAsync(a => a.Id == dto.AppointmentId.Value))
        {
            return BadRequest("Selected appointment does not exist.");
        }

        var review = new Review
        {
            ClientName = dto.ClientName.Trim(),
            ClientEmail = dto.ClientEmail?.Trim(),
            Rating = dto.Rating,
            Comment = dto.Comment?.Trim(),
            ServiceId = dto.ServiceId,
            AppointmentId = dto.AppointmentId
        };

        if (dto.Photos.Any())
        {
            review.Photos = await SaveReviewPhotos(dto.Photos);
        }

        context.Reviews.Add(review);

        if (await context.SaveChangesAsync() > 0)
        {
            var created = await GetReviewDto(review.Id);
            return CreatedAtAction(nameof(GetReview), new { id = review.Id }, created);
        }

        return BadRequest("Failed to create review.");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ReviewDto>> UpdateReview(int id, [FromForm] UpsertReviewDto dto)
    {
        var review = await context.Reviews
            .Include(r => r.Photos)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null) return NotFound();

        if (!await context.Services.AnyAsync(s => s.Id == dto.ServiceId))
        {
            return BadRequest("Selected service does not exist.");
        }

        if (dto.AppointmentId.HasValue &&
            !await context.Appointments.AnyAsync(a => a.Id == dto.AppointmentId.Value))
        {
            return BadRequest("Selected appointment does not exist.");
        }

        review.ClientName = dto.ClientName.Trim();
        review.ClientEmail = dto.ClientEmail?.Trim();
        review.Rating = dto.Rating;
        review.Comment = dto.Comment?.Trim();
        review.ServiceId = dto.ServiceId;
        review.AppointmentId = dto.AppointmentId;

        var photosToDelete = review.Photos.Where(p => dto.DeletePhotoIds.Contains(p.Id)).ToList();
        foreach (var photo in photosToDelete)
        {
            review.Photos.Remove(photo);
        }
        context.Photos.RemoveRange(photosToDelete);

        if (dto.Photos.Any())
        {
            foreach (var photo in await SaveReviewPhotos(dto.Photos))
            {
                review.Photos.Add(photo);
            }
        }

        if (await context.SaveChangesAsync() >= 0)
        {
            DeleteLocalPhotos(photosToDelete);
            return Ok(await GetReviewDto(id));
        }

        return BadRequest("Failed to update review.");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteReview(int id)
    {
        var review = await context.Reviews
            .Include(r => r.Photos)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null) return NotFound();

        var photos = review.Photos.ToList();
        context.Reviews.Remove(review);

        if (await context.SaveChangesAsync() > 0)
        {
            DeleteLocalPhotos(photos);
            return NoContent();
        }

        return BadRequest("Failed to delete review.");
    }

    private async Task<ReviewDto?> GetReviewDto(int id)
    {
        return await context.Reviews
            .Where(r => r.Id == id)
            .ProjectTo<ReviewDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    private async Task<List<Photo>> SaveReviewPhotos(IEnumerable<IFormFile> files)
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

    private static IQueryable<Review> ApplySorting(
        IQueryable<Review> query,
        string sortBy,
        string sortDirection)
    {
        var descending = sortDirection.Equals("desc", StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLowerInvariant() switch
        {
            "rating" => descending ? query.OrderByDescending(r => r.Rating) : query.OrderBy(r => r.Rating),
            "clientname" => descending ? query.OrderByDescending(r => r.ClientName) : query.OrderBy(r => r.ClientName),
            "servicename" => descending ? query.OrderByDescending(r => r.Service.Name) : query.OrderBy(r => r.Service.Name),
            _ => descending ? query.OrderByDescending(r => r.Created) : query.OrderBy(r => r.Created)
        };
    }
}
