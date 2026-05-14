using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedHomePageSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HomePageSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HeroEyebrow = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroSubtitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryButtonLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryButtonLink = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SecondaryButtonLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SecondaryButtonLink = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroMainImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroSecondaryImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroLogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatOneValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatOneLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatTwoValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatTwoLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatThreeValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatThreeLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SignatureTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SignatureBody = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShowServicesSection = table.Column<bool>(type: "bit", nullable: false),
                    ShowGallerySection = table.Column<bool>(type: "bit", nullable: false),
                    ShowReviewsSection = table.Column<bool>(type: "bit", nullable: false),
                    ShowVisitSection = table.Column<bool>(type: "bit", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomePageSettings", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "HomePageSettings",
                columns: new[] { "Id", "HeroEyebrow", "HeroLogoUrl", "HeroMainImageUrl", "HeroSecondaryImageUrl", "HeroSubtitle", "HeroTitle", "PrimaryButtonLabel", "PrimaryButtonLink", "SecondaryButtonLabel", "SecondaryButtonLink", "ShowGallerySection", "ShowReviewsSection", "ShowServicesSection", "ShowVisitSection", "SignatureBody", "SignatureTitle", "StatOneLabel", "StatOneValue", "StatThreeLabel", "StatThreeValue", "StatTwoLabel", "StatTwoValue", "UpdatedAt" },
                values: new object[] { 1, "Brows, lashes, and soft-glam confidence", "/brand/kims-brow-lash-mark.svg", "/brand/kims-brow-lash-client-hero.png", "/brand/kims-brow-lash-service-result.png", "Kim's Brow & Lash creates polished brows and refined lash looks with a calm studio experience, thoughtful timing, and results designed around your natural features.", "Effortless beauty, shaped with intention.", "Explore services", "/services", "Book an appointment", "/book-appointment", true, true, true, true, "Clean mapping, balanced brows, and lash looks that feel elevated without feeling heavy.", "Signature detail", "Reviews", "5★", "Finish", "Soft", "Styling", "1:1", new DateTime(2026, 5, 14, 0, 0, 0, 0, DateTimeKind.Utc) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HomePageSettings");
        }
    }
}
