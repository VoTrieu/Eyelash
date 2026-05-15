using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedHomeGallerySettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GalleryImageFivePublicId",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageFiveTitle",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageFiveUrl",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageFourPublicId",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageFourTitle",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageFourUrl",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageOnePublicId",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageOneTitle",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageOneUrl",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageSixPublicId",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageSixTitle",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageSixUrl",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageThreePublicId",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageThreeTitle",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageThreeUrl",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageTwoPublicId",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageTwoTitle",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GalleryImageTwoUrl",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "HomePageSettings",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "GalleryImageFivePublicId", "GalleryImageFiveTitle", "GalleryImageFiveUrl", "GalleryImageFourPublicId", "GalleryImageFourTitle", "GalleryImageFourUrl", "GalleryImageOnePublicId", "GalleryImageOneTitle", "GalleryImageOneUrl", "GalleryImageSixPublicId", "GalleryImageSixTitle", "GalleryImageSixUrl", "GalleryImageThreePublicId", "GalleryImageThreeTitle", "GalleryImageThreeUrl", "GalleryImageTwoPublicId", "GalleryImageTwoTitle", "GalleryImageTwoUrl" },
                values: new object[] { null, "Defined Brows", "/brand/kims-brow-lash-service-result.png", null, "Soft Lash Styling", "/brand/kims-brow-lash-client-hero.png", null, "Kim's Brow & Lash Studio", "/brand/kims-brow-lash-client-hero.png", null, "Natural Enhancements", "/brand/kims-brow-lash-logo.png", null, "Luxury Beauty Care", "/brand/kims-brow-lash-logo.png", null, "Brow & Lash Results", "/brand/kims-brow-lash-service-result.png" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GalleryImageFivePublicId",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageFiveTitle",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageFiveUrl",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageFourPublicId",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageFourTitle",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageFourUrl",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageOnePublicId",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageOneTitle",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageOneUrl",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageSixPublicId",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageSixTitle",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageSixUrl",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageThreePublicId",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageThreeTitle",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageThreeUrl",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageTwoPublicId",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageTwoTitle",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "GalleryImageTwoUrl",
                table: "HomePageSettings");
        }
    }
}
