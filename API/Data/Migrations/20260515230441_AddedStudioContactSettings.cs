using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedStudioContactSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StudioAddress",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StudioEmail",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "StudioLatitude",
                table: "HomePageSettings",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "StudioLongitude",
                table: "HomePageSettings",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "StudioPhone",
                table: "HomePageSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "HomePageSettings",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "StudioAddress", "StudioEmail", "StudioLatitude", "StudioLongitude", "StudioPhone" },
                values: new object[] { "5150 Yonge St, North York, ON M2N 6L8", "kimsbrowandlash.ca@gmail.com", 43.768588000000001, -79.415902700000004, "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StudioAddress",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "StudioEmail",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "StudioLatitude",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "StudioLongitude",
                table: "HomePageSettings");

            migrationBuilder.DropColumn(
                name: "StudioPhone",
                table: "HomePageSettings");
        }
    }
}
