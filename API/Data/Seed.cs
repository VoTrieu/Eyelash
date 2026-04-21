using System;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var users = JsonSerializer.Deserialize<List<UserDto>>(userData);

        if (users == null) return;

        foreach (var user in users)
        {
            var appUser = new AppUser
            { 
                UserName = user.Email,
                Email = user.Email,
                DisplayName = user.DisplayName,
                ImageUrl = user.ImageUrl
            };

            appUser.Photos.Add(new Photo
            {
                Url = user.ImageUrl!,
                UserId = appUser.Id
            });

            var result = await userManager.CreateAsync(appUser, "Pa$$w0rd");
            if (!result.Succeeded)
            {
                Console.WriteLine($"Failed to create user {appUser.UserName}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
            else
            {
                await userManager.AddToRoleAsync(appUser, "Client");    
            }

        }

        var admin = new AppUser
        {
            UserName = "admin@test.com",
            Email = "admin@test.com",
            DisplayName = "Admin",
        };

        await userManager.CreateAsync(admin, "Pa$$w0rd");
        var adminResult = await userManager.AddToRoleAsync(admin, "Admin");
        if (!adminResult.Succeeded)        {
            Console.WriteLine($"Failed to create admin user: {string.Join(", ", adminResult.Errors.Select(e => e.Description))}");
        }          
    }

}
