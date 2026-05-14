using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedHomePageSettingsCloudinaryIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeroLogoPublicId",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeroMainImagePublicId",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeroSecondaryImagePublicId",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "HomePageSettings",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "HeroLogoPublicId", "HeroMainImagePublicId", "HeroSecondaryImagePublicId" },
                values: new object[] { null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeroLogoPublicId",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "HeroMainImagePublicId",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "HeroSecondaryImagePublicId",
                table: "HomePageSettings");
        }
    }
}
