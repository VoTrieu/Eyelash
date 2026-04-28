using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedAppointmentManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppointmentId",
                table: "Photos",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ClientId",
                table: "Appointments",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "ClientEmail",
                table: "Appointments",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ClientName",
                table: "Appointments",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ClientPhone",
                table: "Appointments",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ConfirmationNotificationSent",
                table: "Appointments",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ConfirmedAt",
                table: "Appointments",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Appointments",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AppointmentSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SendConfirmationNotifications = table.Column<bool>(type: "INTEGER", nullable: false),
                    SendSms = table.Column<bool>(type: "INTEGER", nullable: false),
                    SendEmail = table.Column<bool>(type: "INTEGER", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentSettings", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AppointmentSettings",
                columns: new[] { "Id", "SendConfirmationNotifications", "SendEmail", "SendSms", "UpdatedAt" },
                values: new object[] { 1, true, true, false, new DateTime(2026, 4, 28, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.CreateIndex(
                name: "IX_Photos_AppointmentId",
                table: "Photos",
                column: "AppointmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Appointments_AppointmentId",
                table: "Photos",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Appointments_AppointmentId",
                table: "Photos");

            migrationBuilder.DropTable(
                name: "AppointmentSettings");

            migrationBuilder.DropIndex(
                name: "IX_Photos_AppointmentId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "AppointmentId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "ClientEmail",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ClientName",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ClientPhone",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ConfirmationNotificationSent",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ConfirmedAt",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Appointments");

            migrationBuilder.AlterColumn<string>(
                name: "ClientId",
                table: "Appointments",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);
        }
    }
}
