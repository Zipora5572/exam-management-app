using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class changeDataContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentExams_Users_StudentId",
                table: "StudentExams");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentExams_Users_StudentId",
                table: "StudentExams",
                column: "StudentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentExams_Users_StudentId",
                table: "StudentExams");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentExams_Users_StudentId",
                table: "StudentExams",
                column: "StudentId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
