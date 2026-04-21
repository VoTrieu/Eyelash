using System;
using System.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Photo> Photos { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = "5497ed73-6484-47e4-bba4-bf4f3b16b410", Name = "Client", NormalizedName = "CLIENT", ConcurrencyStamp = "760ea235-688e-433d-a2ed-f5ad111b337e" },
            new IdentityRole { Id = "46d90ffa-c104-471d-9eea-55f64b8b8cd8", Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = "f4eb28ab-6138-4b63-90ff-e9d2dd04e43b" }
        );
    
    }
}
