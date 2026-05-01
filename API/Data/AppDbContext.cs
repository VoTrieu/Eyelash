using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
{

    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<AppointmentSettings> AppointmentSettings { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Photo> Photos { get; set; }
    
    public DbSet<AppointmentAvailabilityBlock> AppointmentAvailabilityBlocks { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = "5497ed73-6484-47e4-bba4-bf4f3b16b410", Name = "Client", NormalizedName = "CLIENT", ConcurrencyStamp = "760ea235-688e-433d-a2ed-f5ad111b337e" },
            new IdentityRole { Id = "46d90ffa-c104-471d-9eea-55f64b8b8cd8", Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = "f4eb28ab-6138-4b63-90ff-e9d2dd04e43b" },
            new IdentityRole { Id = "d1c9e5b8-7a3c-4f0e-9b2a-8c6e5f1a2b3c", Name = "Moderator", NormalizedName = "MODERATOR", ConcurrencyStamp = "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
        );

        // Appointment -> AppUser (Client)
        builder.Entity<Appointment>()
            .HasOne(a => a.Client)
            .WithMany(u => u.Appointments)
            .HasForeignKey(a => a.ClientId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent multiple cascade paths

        builder.Entity<AppointmentSettings>().HasData(new AppointmentSettings
        {
            Id = 1,
            SendConfirmationNotifications = true,
            SendEmail = true,
            SendSms = false,
            UpdatedAt = new DateTime(2026, 4, 28, 0, 0, 0, DateTimeKind.Utc)
        });

        // Review -> AppUser (Client)
        builder.Entity<Review>()
            .HasOne(r => r.Client)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.ClientId)
            .OnDelete(DeleteBehavior.Restrict); 

        // Review -> Appointment (1-to-1)
        builder.Entity<Review>()
            .HasOne(r => r.Appointment)
            .WithOne(a => a.Review)
            .HasForeignKey<Review>(r => r.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Review -> Service
        builder.Entity<Review>()
            .HasOne(r => r.Service)
            .WithMany(s => s.Reviews)
            .HasForeignKey(r => r.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        // Photo relationships
        builder.Entity<Photo>()
            .HasOne(p => p.User)
            .WithMany(u => u.Photos)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Photo>()
            .HasOne(p => p.Service)
            .WithMany(s => s.Photos)
            .HasForeignKey(p => p.ServiceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Photo>()
            .HasOne(p => p.Review)
            .WithMany(r => r.Photos)
            .HasForeignKey(p => p.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Photo>()
            .HasOne(p => p.Appointment)
            .WithMany(a => a.Photos)
            .HasForeignKey(p => p.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Appointment <-> Service (Many-to-Many)
        builder.Entity<Appointment>()
            .HasMany(a => a.Services)
            .WithMany(s => s.Appointments)
            .UsingEntity(j => j.ToTable("AppointmentServices")); 

    }
}
