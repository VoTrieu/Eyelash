using System;
using System.Diagnostics;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedServices(AppDbContext context)
    {
        var services = new List<Service>
        {
            new()
            {
                Name = "Classic Lash Set",
                Price = 95,
                DurationInMinutes = 90,
                Description = "A soft, natural lash enhancement with one extension applied to each healthy natural lash. Perfect for first-time clients or everyday polish.",
                Photos =
                [
                    new Photo { Url = "/brand/kims-brow-lash-service-result.png", IsMain = true },
                    new Photo { Url = "/brand/kims-brow-lash-client-hero.png" }
                ]
            },
            new()
            {
                Name = "Hybrid Lash Set",
                Price = 125,
                DurationInMinutes = 120,
                Description = "A balanced mix of classic and volume fans for soft fullness, gentle texture, and a little extra glam without feeling heavy.",
                Photos =
                [
                    new Photo { Url = "/brand/kims-brow-lash-client-hero.png", IsMain = true },
                    new Photo { Url = "/brand/kims-brow-lash-service-result.png" }
                ]
            },
            new()
            {
                Name = "Volume Lash Set",
                Price = 145,
                DurationInMinutes = 150,
                Description = "Lightweight handmade fans create a fuller, fluffy lash line with elegant density and a customized shape for your eyes.",
                Photos =
                [
                    new Photo { Url = "/brand/kims-brow-lash-service-result.png", IsMain = true }
                ]
            },
            new()
            {
                Name = "Mega Volume Lash Set",
                Price = 175,
                DurationInMinutes = 180,
                Description = "Maximum drama with a dark, plush lash line using ultra-fine extensions. Best for clients who love a bold, statement finish.",
                Photos =
                [
                    new Photo { Url = "/brand/kims-brow-lash-client-hero.png", IsMain = true }
                ]
            },
            new()
            {
                Name = "Lash Fill - Classic",
                Price = 55,
                DurationInMinutes = 60,
                Description = "Refresh your classic set by replacing grown-out extensions and restoring a clean, even lash line.",
                Photos =
                [
                    new Photo { Url = "/brand/kims-brow-lash-service-result.png", IsMain = true }
                ]
            },
            new()
            {
                Name = "Lash Fill - Volume",
                Price = 75,
                DurationInMinutes = 75,
                Description = "A volume maintenance appointment to rebalance fullness, remove outgrown fans, and keep your set looking fresh.",
                Photos =
                [
                    new Photo { Url = "/brand/kims-brow-lash-client-hero.png", IsMain = true }
                ]
            },
            new()
            {
                Name = "Lash Lift & Tint",
                Price = 85,
                DurationInMinutes = 60,
                Description = "Enhance your natural lashes with a lifted curl and rich tint for a low-maintenance, mascara-free look.",
                Photos =
                [
                    new Photo { Url = "/brand/kims-brow-lash-service-result.png", IsMain = true }
                ]
            },
            new()
            {
                Name = "Brow Shaping",
                Price = 35,
                DurationInMinutes = 30,
                Description = "Detailed brow mapping, shaping, and cleanup to create a balanced frame that fits your natural features.",
                Photos =
                [
                    new Photo { Url = "/brand/kims-brow-lash-client-hero.png", IsMain = true }
                ]
            },
            new()
            {
                Name = "Brow Lamination",
                Price = 80,
                DurationInMinutes = 60,
                Description = "A smoothing and setting treatment for fuller-looking brows with a brushed-up, polished finish.",
                Photos =
                [
                    new Photo { Url = "/brand/kims-brow-lash-service-result.png", IsMain = true }
                ]
            },
            new()
            {
                Name = "Brow Tint & Shape",
                Price = 55,
                DurationInMinutes = 45,
                Description = "Brow tinting paired with shaping to add definition, fill the look of sparse areas, and sharpen your overall brow design.",
                Photos =
                [
                    new Photo { Url = "/brand/kims-brow-lash-client-hero.png", IsMain = true },
                    new Photo { Url = "/brand/kims-brow-lash-service-result.png" }
                ]
            }
        };

        var existingServiceNames = await context.Services
            .Select(s => s.Name)
            .ToListAsync();

        var newServices = services
            .Where(service => !existingServiceNames.Contains(service.Name))
            .ToList();

        if (newServices.Count == 0) return;

        context.Services.AddRange(newServices);
        await context.SaveChangesAsync();
    }

    public static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var users = JsonSerializer.Deserialize<List<SeedUserDto>>(userData);


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
            });

            var result = await userManager.CreateAsync(appUser, "Pa$$w0rd");
          
            if (!result.Succeeded)
            {
                Console.WriteLine($"❌ {string.Join(", ", result.Errors.Select(e => e.Description))}");
                continue;
            }
            await userManager.AddToRoleAsync(appUser, "Client");    
      

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
        Console.WriteLine($"Users count: {userManager.Users.Count()}");        
    }

}
