using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseApiController
{
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user == null) return Unauthorized("Invalid email or password");
        if (await userManager.IsLockedOutAsync(user)) return Unauthorized("Invalid email or password");

        var result = await userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!result) return Unauthorized("Invalid email or password");
        await SetRefreshTokenCookie(user);
        return await user.ToDto(tokenService);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var existingUser = await userManager.FindByEmailAsync(registerDto.Email);
        if (existingUser != null) return BadRequest("Email is already in use");

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            PhoneNumber = registerDto.PhoneNumber,
            UserName = registerDto.Email,
            Gender = registerDto.Gender,
            Address = registerDto.Address,
            DateOfBirth = registerDto.DateOfBirth,
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("identity", error.Description);
            }
            return ValidationProblem();
        }

        await userManager.AddToRoleAsync(user, "Client");
        await SetRefreshTokenCookie(user);

        return await user.ToDto(tokenService);
    }

    private async Task SetRefreshTokenCookie(AppUser user)
    {
        var refreshToken = tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(1);
        await userManager.UpdateAsync(user);
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(1)
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<UserDto>> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken)) return NoContent();

        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken
                && u.RefreshTokenExpiry > DateTime.UtcNow);

        if (user == null)
        {
            return Unauthorized("Invalid or expired refresh token");
        }

        var newRefreshToken = tokenService.GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(1);
        await userManager.UpdateAsync(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(1)
        };
        Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);

        return await user.ToDto(tokenService);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await userManager.Users
            .Where(x => x.Id == User.GetUserId())
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(u => u.RefreshToken, _ => null)
                .SetProperty(u => u.RefreshTokenExpiry, _ => null));

        Response.Cookies.Delete("refreshToken");

        return Ok();
    }
}
