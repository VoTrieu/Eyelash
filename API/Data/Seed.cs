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

    public static async Task SeedReviews(AppDbContext context)
    {
        var servicesByName = await context.Services
            .Select(s => new { s.Id, s.Name })
            .ToDictionaryAsync(s => s.Name, s => s.Id);

        var existingReviews = await context.Reviews
            .Select(r => new { r.ClientEmail, r.ServiceId, r.Comment })
            .ToListAsync();

        var existingReviewKeys = existingReviews
            .Select(r => $"{r.ClientEmail}|{r.ServiceId}|{r.Comment}")
            .ToList();

        var reviews = new List<Review>();

        AddReview(
            servicesByName,
            existingReviewKeys,
            reviews,
            serviceName: "Classic Lash Set",
            clientName: "Mia Nguyen",
            clientEmail: "mia.nguyen@example.com",
            rating: 5,
            comment: "My classic set looked soft and natural, exactly what I wanted for work every day. Kim was gentle, detailed, and explained aftercare clearly.",
            created: new DateTime(2026, 5, 2, 14, 30, 0, DateTimeKind.Utc),
            photos:
            [
                new Photo { Url = "/brand/kims-brow-lash-service-result.png", IsMain = true }
            ]);

        AddReview(
            servicesByName,
            existingReviewKeys,
            reviews,
            serviceName: "Hybrid Lash Set",
            clientName: "Samantha Lee",
            clientEmail: "samantha.lee@example.com",
            rating: 5,
            comment: "The hybrid lashes gave me the perfect mix of natural and glam. I received so many compliments and the retention was amazing.",
            created: new DateTime(2026, 5, 4, 17, 10, 0, DateTimeKind.Utc),
            photos:
            [
                new Photo { Url = "/brand/kims-brow-lash-client-hero.png", IsMain = true },
                new Photo { Url = "/brand/kims-brow-lash-service-result.png" }
            ]);

        AddReview(
            servicesByName,
            existingReviewKeys,
            reviews,
            serviceName: "Volume Lash Set",
            clientName: "Jessica Tran",
            clientEmail: "jessica.tran@example.com",
            rating: 5,
            comment: "Beautiful fluffy volume without feeling heavy. The shape opened my eyes so nicely and still felt comfortable.",
            created: new DateTime(2026, 5, 6, 19, 45, 0, DateTimeKind.Utc),
            photos:
            [
                new Photo { Url = "/brand/kims-brow-lash-service-result.png", IsMain = true }
            ]);

        AddReview(
            servicesByName,
            existingReviewKeys,
            reviews,
            serviceName: "Lash Lift & Tint",
            clientName: "Emily Carter",
            clientEmail: "emily.carter@example.com",
            rating: 4,
            comment: "I wanted something low maintenance and the lift made my natural lashes look much longer. The tint was a lovely bonus.",
            created: new DateTime(2026, 5, 7, 15, 0, 0, DateTimeKind.Utc),
            photos:
            [
                new Photo { Url = "/brand/kims-brow-lash-client-hero.png", IsMain = true }
            ]);

        AddReview(
            servicesByName,
            existingReviewKeys,
            reviews,
            serviceName: "Brow Lamination",
            clientName: "Olivia Brown",
            clientEmail: "olivia.brown@example.com",
            rating: 5,
            comment: "My brows finally look full and tidy without makeup. The lamination result was polished but still natural.",
            created: new DateTime(2026, 5, 9, 16, 20, 0, DateTimeKind.Utc),
            photos:
            [
                new Photo { Url = "/brand/kims-brow-lash-service-result.png", IsMain = true }
            ]);

        AddReview(
            servicesByName,
            existingReviewKeys,
            reviews,
            serviceName: "Brow Tint & Shape",
            clientName: "Rachel Kim",
            clientEmail: "rachel.kim@example.com",
            rating: 5,
            comment: "The tint and shaping made my brows look so much more balanced. Booking was easy and the studio felt calm and clean.",
            created: new DateTime(2026, 5, 10, 18, 5, 0, DateTimeKind.Utc),
            photos:
            [
                new Photo { Url = "/brand/kims-brow-lash-client-hero.png", IsMain = true }
            ]);

        if (reviews.Count == 0) return;

        context.Reviews.AddRange(reviews);
        await context.SaveChangesAsync();
    }

    private static void AddReview(
        Dictionary<string, int> servicesByName,
        List<string> existingReviewKeys,
        List<Review> reviews,
        string serviceName,
        string clientName,
        string clientEmail,
        byte rating,
        string comment,
        DateTime created,
        List<Photo> photos)
    {
        if (!servicesByName.TryGetValue(serviceName, out var serviceId)) return;

        var reviewKey = $"{clientEmail}|{serviceId}|{comment}";
        if (existingReviewKeys.Contains(reviewKey)) return;

        existingReviewKeys.Add(reviewKey);
        reviews.Add(new Review
        {
            ServiceId = serviceId,
            ClientName = clientName,
            ClientEmail = clientEmail,
            Rating = rating,
            Comment = comment,
            Created = created,
            Photos = photos
        });
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
