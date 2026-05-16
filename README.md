# Eyelash

Full-stack booking and administration app for Kim's Brow & Lash.

The solution contains an ASP.NET Core API, an Angular client, SQL Server persistence, JWT-based admin authentication, service photo galleries, appointment requests, reviews, home page settings, contact forms, email notifications, and SignalR appointment updates.

## Tech Stack

- ASP.NET Core 10
- Entity Framework Core with SQL Server
- ASP.NET Core Identity and JWT authentication
- Angular 21
- PrimeNG, Tailwind CSS, and SignalR client
- Cloudinary for uploaded images
- SMTP for contact and appointment notification emails

## Project Structure

```text
API/        ASP.NET Core backend, EF Core migrations, DTOs, repositories, services
Frontend/   Angular application
docker-compose.yml
Eyelash.sln
```

## Requirements

- .NET SDK 10
- Node.js 22.12 or newer
- npm 11 or newer
- Docker, for the local SQL Server container

## Local Setup

Start SQL Server:

```bash
docker compose up -d
```

Install frontend dependencies:

```bash
cd Frontend
npm ci
```

Configure backend settings in `API/appsettings.Development.json` or user secrets:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=EyelashDb;User Id=sa;Password=Password@1;Encrypt=true;TrustServerCertificate=true;"
  },
  "TokenKey": "replace-with-a-long-local-development-token-key-at-least-64-characters",
  "CloudinarySettings": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  },
  "Notifications": {
    "Smtp": {
      "Host": "smtp.gmail.com",
      "Port": "587",
      "EnableSsl": "true",
      "From": "studio@example.com",
      "Username": "studio@example.com",
      "Password": "your-app-password"
    },
    "Contact": {
      "StudioRecipient": "studio@example.com"
    }
  }
}
```

Run the API:

```bash
cd API
dotnet run
```

The API applies migrations and seeds data on startup.

Run the Angular app:

```bash
cd Frontend
npm start
```

Open `https://localhost:4200`.

## Seeded Login

The development seed creates an admin account:

```text
Email: admin@test.com
Password: Pa$$w0rd
```

## Common Commands

Build the full solution:

```bash
dotnet build Eyelash.sln
```

Build the frontend:

```bash
cd Frontend
npm run build
```

Run frontend tests:

```bash
cd Frontend
npm test
```

## API Notes

- `GET /api/services` returns a paginated services list, including gallery photos.
- `GET /api/services/{id}` returns service details, including photos and reviews.
- Admin-only service mutations require a JWT with the `Admin` role.
- The appointment hub is available at `/hubs/appointments`.

## Deployment Notes

The API project has a publish target that builds the Angular production bundle and copies it into `wwwroot`, allowing the ASP.NET Core app to serve the client application. Production frontend calls use a relative API URL (`api/`).

Do not commit production secrets. Use environment variables, user secrets, or the deployment platform's secret store for connection strings, JWT keys, Cloudinary credentials, and SMTP credentials.
