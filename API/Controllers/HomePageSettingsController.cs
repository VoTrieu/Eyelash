using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class HomePageSettingsController(
    AppDbContext context,
    IPhotoService photoService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<HomePageSettingsDto>> GetHomePageSettings()
    {
        var settings = await GetOrCreateSettings();
        return ToDto(settings);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<HomePageSettingsDto>> UpdateHomePageSettings(
        [FromForm] UpdateHomePageSettingsDto dto)
    {
        var settings = await GetOrCreateSettings();

        settings.HeroEyebrow = dto.HeroEyebrow.Trim();
        settings.HeroTitle = dto.HeroTitle.Trim();
        settings.HeroSubtitle = dto.HeroSubtitle.Trim();
        settings.PrimaryButtonLabel = dto.PrimaryButtonLabel.Trim();
        settings.PrimaryButtonLink = NormalizeRoute(dto.PrimaryButtonLink);
        settings.SecondaryButtonLabel = dto.SecondaryButtonLabel.Trim();
        settings.SecondaryButtonLink = NormalizeRoute(dto.SecondaryButtonLink);
        settings.HeroMainImageUrl = dto.HeroMainImageUrl.Trim();
        settings.HeroSecondaryImageUrl = dto.HeroSecondaryImageUrl.Trim();
        settings.HeroLogoUrl = dto.HeroLogoUrl.Trim();
        settings.StatOneValue = dto.StatOneValue.Trim();
        settings.StatOneLabel = dto.StatOneLabel.Trim();
        settings.StatTwoValue = dto.StatTwoValue.Trim();
        settings.StatTwoLabel = dto.StatTwoLabel.Trim();
        settings.StatThreeValue = dto.StatThreeValue.Trim();
        settings.StatThreeLabel = dto.StatThreeLabel.Trim();
        settings.SignatureTitle = dto.SignatureTitle.Trim();
        settings.SignatureBody = dto.SignatureBody.Trim();
        settings.ShowServicesSection = dto.ShowServicesSection;
        settings.ShowGallerySection = dto.ShowGallerySection;
        settings.ShowReviewsSection = dto.ShowReviewsSection;
        settings.ShowVisitSection = dto.ShowVisitSection;
        settings.UpdatedAt = DateTime.UtcNow;

        if (dto.HeroMainImage != null)
        {
            await ReplaceHeroImage(
                dto.HeroMainImage,
                settings.HeroMainImagePublicId,
                url => settings.HeroMainImageUrl = url,
                publicId => settings.HeroMainImagePublicId = publicId);
        }

        if (dto.HeroSecondaryImage != null)
        {
            await ReplaceHeroImage(
                dto.HeroSecondaryImage,
                settings.HeroSecondaryImagePublicId,
                url => settings.HeroSecondaryImageUrl = url,
                publicId => settings.HeroSecondaryImagePublicId = publicId);
        }

        if (dto.HeroLogoImage != null)
        {
            await ReplaceHeroImage(
                dto.HeroLogoImage,
                settings.HeroLogoPublicId,
                url => settings.HeroLogoUrl = url,
                publicId => settings.HeroLogoPublicId = publicId);
        }

        await context.SaveChangesAsync();

        return ToDto(settings);
    }

    private async Task<HomePageSettings> GetOrCreateSettings()
    {
        var settings = await context.HomePageSettings.FirstOrDefaultAsync(s => s.Id == 1);
        if (settings != null) return settings;

        settings = CreateDefaultSettings();
        context.HomePageSettings.Add(settings);
        await context.SaveChangesAsync();

        return settings;
    }

    private static HomePageSettings CreateDefaultSettings()
    {
        return new HomePageSettings
        {
            Id = 1,
            HeroEyebrow = "Brows, lashes, and soft-glam confidence",
            HeroTitle = "Effortless beauty, shaped with intention.",
            HeroSubtitle = "Kim's Brow & Lash creates polished brows and refined lash looks with a calm studio experience, thoughtful timing, and results designed around your natural features.",
            PrimaryButtonLabel = "Explore services",
            PrimaryButtonLink = "/services",
            SecondaryButtonLabel = "Book an appointment",
            SecondaryButtonLink = "/book-appointment",
            HeroMainImageUrl = "/brand/kims-brow-lash-client-hero.png",
            HeroMainImagePublicId = null,
            HeroSecondaryImageUrl = "/brand/kims-brow-lash-service-result.png",
            HeroSecondaryImagePublicId = null,
            HeroLogoUrl = "/brand/kims-brow-lash-mark.svg",
            HeroLogoPublicId = null,
            StatOneValue = "5★",
            StatOneLabel = "Reviews",
            StatTwoValue = "1:1",
            StatTwoLabel = "Styling",
            StatThreeValue = "Soft",
            StatThreeLabel = "Finish",
            SignatureTitle = "Signature detail",
            SignatureBody = "Clean mapping, balanced brows, and lash looks that feel elevated without feeling heavy.",
            ShowServicesSection = true,
            ShowGallerySection = true,
            ShowReviewsSection = true,
            ShowVisitSection = true,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private static HomePageSettingsDto ToDto(HomePageSettings settings)
    {
        return new HomePageSettingsDto
        {
            Id = settings.Id,
            HeroEyebrow = settings.HeroEyebrow,
            HeroTitle = settings.HeroTitle,
            HeroSubtitle = settings.HeroSubtitle,
            PrimaryButtonLabel = settings.PrimaryButtonLabel,
            PrimaryButtonLink = settings.PrimaryButtonLink,
            SecondaryButtonLabel = settings.SecondaryButtonLabel,
            SecondaryButtonLink = settings.SecondaryButtonLink,
            HeroMainImageUrl = settings.HeroMainImageUrl,
            HeroMainImagePublicId = settings.HeroMainImagePublicId,
            HeroSecondaryImageUrl = settings.HeroSecondaryImageUrl,
            HeroSecondaryImagePublicId = settings.HeroSecondaryImagePublicId,
            HeroLogoUrl = settings.HeroLogoUrl,
            HeroLogoPublicId = settings.HeroLogoPublicId,
            StatOneValue = settings.StatOneValue,
            StatOneLabel = settings.StatOneLabel,
            StatTwoValue = settings.StatTwoValue,
            StatTwoLabel = settings.StatTwoLabel,
            StatThreeValue = settings.StatThreeValue,
            StatThreeLabel = settings.StatThreeLabel,
            SignatureTitle = settings.SignatureTitle,
            SignatureBody = settings.SignatureBody,
            ShowServicesSection = settings.ShowServicesSection,
            ShowGallerySection = settings.ShowGallerySection,
            ShowReviewsSection = settings.ShowReviewsSection,
            ShowVisitSection = settings.ShowVisitSection,
            UpdatedAt = settings.UpdatedAt
        };
    }

    private static string NormalizeRoute(string value)
    {
        var route = value.Trim();
        if (string.IsNullOrWhiteSpace(route)) return "/";
        if (route.StartsWith("http", StringComparison.OrdinalIgnoreCase)) return route;
        return route.StartsWith('/') ? route : $"/{route}";
    }

    private async Task ReplaceHeroImage(
        IFormFile image,
        string? oldPublicId,
        Action<string> setUrl,
        Action<string> setPublicId)
    {
        var uploadResult = await photoService.UploadRawPhotoAsync(image);
        if (uploadResult.Error != null)
        {
            throw new InvalidOperationException(uploadResult.Error.Message);
        }

        if (!string.IsNullOrWhiteSpace(oldPublicId))
        {
            await photoService.DeletePhotoAsync(oldPublicId);
        }

        setUrl(uploadResult.SecureUrl.AbsoluteUri);
        setPublicId(uploadResult.PublicId);
    }
}
