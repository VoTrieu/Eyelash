using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize(Policy = "RequireAdminRole")]
public class AdminUsersController(
    UserManager<AppUser> userManager,
    RoleManager<IdentityRole> roleManager,
    IWebHostEnvironment env) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<AdminUserDto>>> GetUsers(
        [FromQuery] AdminUserParams userParams)
    {
        var query = userManager.Users.AsQueryable();
        var now = DateTimeOffset.UtcNow;

        if (!string.IsNullOrWhiteSpace(userParams.Search))
        {
            var search = userParams.Search.Trim().ToLower();
            query = query.Where(u =>
                u.DisplayName.ToLower().Contains(search) ||
                u.Email!.ToLower().Contains(search) ||
                (u.PhoneNumber != null && u.PhoneNumber.Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(userParams.Role))
        {
            var usersInRole = await userManager.GetUsersInRoleAsync(userParams.Role);
            var userIds = usersInRole.Select(u => u.Id).ToList();
            query = query.Where(u => userIds.Contains(u.Id));
        }

        if (userParams.IsActive.HasValue)
        {
            query = userParams.IsActive.Value
                ? query.Where(u => !u.LockoutEnd.HasValue || u.LockoutEnd <= now)
                : query.Where(u => u.LockoutEnd.HasValue && u.LockoutEnd > now);
        }

        query = ApplySorting(query, userParams.SortBy, userParams.SortDirection);

        var totalItems = await query.CountAsync();
        var users = await query
            .Skip((userParams.PageNumber - 1) * userParams.PageSize)
            .Take(userParams.PageSize)
            .ToListAsync();

        var items = new List<AdminUserDto>();
        foreach (var user in users)
        {
            items.Add(await ToAdminUserDto(user));
        }

        return new PaginatedResult<AdminUserDto>
        {
            Items = items,
            Metadata = new PaginationMetadata
            {
                CurrentPage = userParams.PageNumber,
                PageSize = userParams.PageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)userParams.PageSize)
            }
        };
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AdminUserDto>> GetUser(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        return await ToAdminUserDto(user);
    }

    [HttpGet("roles")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetRoles()
    {
        return await roleManager.Roles
            .OrderBy(r => r.Name)
            .Select(r => r.Name!)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<AdminUserDto>> CreateUser([FromForm] UpsertAdminUserDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest("Password is required when creating a user.");
        }

        var existingUser = await userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null) return BadRequest("Email is already in use.");

        var user = new AppUser
        {
            DisplayName = dto.DisplayName.Trim(),
            Email = dto.Email.Trim(),
            UserName = dto.Email.Trim(),
            PhoneNumber = dto.PhoneNumber?.Trim(),
            Gender = dto.Gender?.Trim(),
            Address = dto.Address?.Trim(),
            DateOfBirth = dto.DateOfBirth,
            LockoutEnabled = true,
            LockoutEnd = dto.IsActive ? null : DateTimeOffset.MaxValue
        };

        var result = await userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded) return ValidationProblemFromIdentity(result);

        var roles = await ValidateRoles(dto.Roles);
        result = await userManager.AddToRolesAsync(user, roles.Count > 0 ? roles : ["Client"]);
        if (!result.Succeeded) return ValidationProblemFromIdentity(result);

        if (dto.Avatar is { Length: > 0 })
        {
            user.ImageUrl = await SaveAvatar(dto.Avatar);
            result = await userManager.UpdateAsync(user);
            if (!result.Succeeded) return ValidationProblemFromIdentity(result);
        }

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, await ToAdminUserDto(user));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AdminUserDto>> UpdateUser(string id, [FromForm] UpsertAdminUserDto dto)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        var existingUser = await userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null && existingUser.Id != id)
        {
            return BadRequest("Email is already in use.");
        }

        user.DisplayName = dto.DisplayName.Trim();
        user.Email = dto.Email.Trim();
        user.UserName = dto.Email.Trim();
        user.PhoneNumber = dto.PhoneNumber?.Trim();
        user.Gender = dto.Gender?.Trim();
        user.Address = dto.Address?.Trim();
        user.DateOfBirth = dto.DateOfBirth;
        user.LockoutEnabled = true;
        user.LockoutEnd = dto.IsActive ? null : DateTimeOffset.MaxValue;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded) return ValidationProblemFromIdentity(result);

        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
            result = await userManager.ResetPasswordAsync(user, resetToken, dto.Password);
            if (!result.Succeeded) return ValidationProblemFromIdentity(result);
        }

        var roles = await ValidateRoles(dto.Roles);
        var currentRoles = await userManager.GetRolesAsync(user);

        result = await userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!result.Succeeded) return ValidationProblemFromIdentity(result);

        result = await userManager.AddToRolesAsync(user, roles.Count > 0 ? roles : ["Client"]);
        if (!result.Succeeded) return ValidationProblemFromIdentity(result);

        if (dto.Avatar is { Length: > 0 })
        {
            var previousImageUrl = user.ImageUrl;
            user.ImageUrl = await SaveAvatar(dto.Avatar);

            result = await userManager.UpdateAsync(user);
            if (!result.Succeeded) return ValidationProblemFromIdentity(result);

            DeleteLocalAvatar(previousImageUrl);
        }

        return Ok(await ToAdminUserDto(user));
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<AdminUserDto>> UpdateUserStatus(string id, UpdateAdminUserStatusDto dto)
    {
        if (id == User.GetUserId()) return BadRequest("You cannot deactivate your own account.");

        var user = await userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        user.LockoutEnabled = true;
        user.LockoutEnd = dto.IsActive ? null : DateTimeOffset.MaxValue;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded) return ValidationProblemFromIdentity(result);

        return Ok(await ToAdminUserDto(user));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(string id)
    {
        if (id == User.GetUserId()) return BadRequest("You cannot delete your own account.");

        var user = await userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        var imageUrl = user.ImageUrl;
        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded) return ValidationProblemFromIdentity(result);

        DeleteLocalAvatar(imageUrl);

        return NoContent();
    }

    private async Task<AdminUserDto> ToAdminUserDto(AppUser user)
    {
        var roles = await userManager.GetRolesAsync(user);

        return new AdminUserDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email!,
            PhoneNumber = user.PhoneNumber,
            ImageUrl = user.ImageUrl,
            Gender = user.Gender,
            Address = user.Address,
            DateOfBirth = user.DateOfBirth,
            Created = user.Created,
            LastActive = user.LastActive,
            IsActive = !user.LockoutEnd.HasValue || user.LockoutEnd <= DateTimeOffset.UtcNow,
            Roles = roles.ToList()
        };
    }

    private async Task<string> SaveAvatar(IFormFile file)
    {
        var imagesPath = GetImagesPath();
        Directory.CreateDirectory(imagesPath);

        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(imagesPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/Images/{fileName}";
    }

    private void DeleteLocalAvatar(string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl) ||
            !imageUrl.StartsWith("/Images/", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        var fileName = Path.GetFileName(imageUrl);
        var filePath = Path.Combine(GetImagesPath(), fileName);

        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }
    }

    private string GetImagesPath()
    {
        var webRoot = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        return Path.Combine(webRoot, "Images");
    }

    private async Task<List<string>> ValidateRoles(IEnumerable<string> roleNames)
    {
        var validRoles = await roleManager.Roles.Select(r => r.Name!).ToListAsync();
        return roleNames
            .Where(role => validRoles.Contains(role))
            .Distinct()
            .ToList();
    }

    private static IQueryable<AppUser> ApplySorting(
        IQueryable<AppUser> query,
        string sortBy,
        string sortDirection)
    {
        var descending = sortDirection.Equals("desc", StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLower() switch
        {
            "displayname" => descending
                ? query.OrderByDescending(u => u.DisplayName)
                : query.OrderBy(u => u.DisplayName),
            "email" => descending
                ? query.OrderByDescending(u => u.Email)
                : query.OrderBy(u => u.Email),
            "lastactive" => descending
                ? query.OrderByDescending(u => u.LastActive)
                : query.OrderBy(u => u.LastActive),
            _ => descending
                ? query.OrderByDescending(u => u.Created)
                : query.OrderBy(u => u.Created)
        };
    }

    private ActionResult ValidationProblemFromIdentity(IdentityResult result)
    {
        foreach (var error in result.Errors)
        {
            ModelState.AddModelError("identity", error.Description);
        }

        return ValidationProblem();
    }
}
