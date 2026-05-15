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
        settings.HeroMainImageUrl = KeepExistingIfBlank(dto.HeroMainImageUrl, settings.HeroMainImageUrl);
        settings.HeroSecondaryImageUrl = KeepExistingIfBlank(dto.HeroSecondaryImageUrl, settings.HeroSecondaryImageUrl);
        settings.HeroLogoUrl = KeepExistingIfBlank(dto.HeroLogoUrl, settings.HeroLogoUrl);
        settings.GalleryImageOneUrl = KeepExistingIfBlank(dto.GalleryImageOneUrl, settings.GalleryImageOneUrl);
        settings.GalleryImageOneTitle = dto.GalleryImageOneTitle.Trim();
        settings.GalleryImageTwoUrl = KeepExistingIfBlank(dto.GalleryImageTwoUrl, settings.GalleryImageTwoUrl);
        settings.GalleryImageTwoTitle = dto.GalleryImageTwoTitle.Trim();
        settings.GalleryImageThreeUrl = KeepExistingIfBlank(dto.GalleryImageThreeUrl, settings.GalleryImageThreeUrl);
        settings.GalleryImageThreeTitle = dto.GalleryImageThreeTitle.Trim();
        settings.GalleryImageFourUrl = KeepExistingIfBlank(dto.GalleryImageFourUrl, settings.GalleryImageFourUrl);
        settings.GalleryImageFourTitle = dto.GalleryImageFourTitle.Trim();
        settings.GalleryImageFiveUrl = KeepExistingIfBlank(dto.GalleryImageFiveUrl, settings.GalleryImageFiveUrl);
        settings.GalleryImageFiveTitle = dto.GalleryImageFiveTitle.Trim();
        settings.GalleryImageSixUrl = KeepExistingIfBlank(dto.GalleryImageSixUrl, settings.GalleryImageSixUrl);
        settings.GalleryImageSixTitle = dto.GalleryImageSixTitle.Trim();
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

        if (dto.GalleryImageOne != null)
        {
            await ReplaceHeroImage(
                dto.GalleryImageOne,
                settings.GalleryImageOnePublicId,
                url => settings.GalleryImageOneUrl = url,
                publicId => settings.GalleryImageOnePublicId = publicId);
        }

        if (dto.GalleryImageTwo != null)
        {
            await ReplaceHeroImage(
                dto.GalleryImageTwo,
                settings.GalleryImageTwoPublicId,
                url => settings.GalleryImageTwoUrl = url,
                publicId => settings.GalleryImageTwoPublicId = publicId);
        }

        if (dto.GalleryImageThree != null)
        {
            await ReplaceHeroImage(
                dto.GalleryImageThree,
                settings.GalleryImageThreePublicId,
                url => settings.GalleryImageThreeUrl = url,
                publicId => settings.GalleryImageThreePublicId = publicId);
        }

        if (dto.GalleryImageFour != null)
        {
            await ReplaceHeroImage(
                dto.GalleryImageFour,
                settings.GalleryImageFourPublicId,
                url => settings.GalleryImageFourUrl = url,
                publicId => settings.GalleryImageFourPublicId = publicId);
        }

        if (dto.GalleryImageFive != null)
        {
            await ReplaceHeroImage(
                dto.GalleryImageFive,
                settings.GalleryImageFivePublicId,
                url => settings.GalleryImageFiveUrl = url,
                publicId => settings.GalleryImageFivePublicId = publicId);
        }

        if (dto.GalleryImageSix != null)
        {
            await ReplaceHeroImage(
                dto.GalleryImageSix,
                settings.GalleryImageSixPublicId,
                url => settings.GalleryImageSixUrl = url,
                publicId => settings.GalleryImageSixPublicId = publicId);
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
            GalleryImageOneUrl = "/brand/kims-brow-lash-client-hero.png",
            GalleryImageOnePublicId = null,
            GalleryImageOneTitle = "Kim's Brow & Lash Studio",
            GalleryImageTwoUrl = "/brand/kims-brow-lash-service-result.png",
            GalleryImageTwoPublicId = null,
            GalleryImageTwoTitle = "Brow & Lash Results",
            GalleryImageThreeUrl = "/brand/kims-brow-lash-logo.png",
            GalleryImageThreePublicId = null,
            GalleryImageThreeTitle = "Luxury Beauty Care",
            GalleryImageFourUrl = "/brand/kims-brow-lash-client-hero.png",
            GalleryImageFourPublicId = null,
            GalleryImageFourTitle = "Soft Lash Styling",
            GalleryImageFiveUrl = "/brand/kims-brow-lash-service-result.png",
            GalleryImageFivePublicId = null,
            GalleryImageFiveTitle = "Defined Brows",
            GalleryImageSixUrl = "/brand/kims-brow-lash-logo.png",
            GalleryImageSixPublicId = null,
            GalleryImageSixTitle = "Natural Enhancements",
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
            GalleryImageOneUrl = settings.GalleryImageOneUrl,
            GalleryImageOnePublicId = settings.GalleryImageOnePublicId,
            GalleryImageOneTitle = settings.GalleryImageOneTitle,
            GalleryImageTwoUrl = settings.GalleryImageTwoUrl,
            GalleryImageTwoPublicId = settings.GalleryImageTwoPublicId,
            GalleryImageTwoTitle = settings.GalleryImageTwoTitle,
            GalleryImageThreeUrl = settings.GalleryImageThreeUrl,
            GalleryImageThreePublicId = settings.GalleryImageThreePublicId,
            GalleryImageThreeTitle = settings.GalleryImageThreeTitle,
            GalleryImageFourUrl = settings.GalleryImageFourUrl,
            GalleryImageFourPublicId = settings.GalleryImageFourPublicId,
            GalleryImageFourTitle = settings.GalleryImageFourTitle,
            GalleryImageFiveUrl = settings.GalleryImageFiveUrl,
            GalleryImageFivePublicId = settings.GalleryImageFivePublicId,
            GalleryImageFiveTitle = settings.GalleryImageFiveTitle,
            GalleryImageSixUrl = settings.GalleryImageSixUrl,
            GalleryImageSixPublicId = settings.GalleryImageSixPublicId,
            GalleryImageSixTitle = settings.GalleryImageSixTitle,
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

    private static string KeepExistingIfBlank(string newValue, string existingValue)
    {
        return string.IsNullOrWhiteSpace(newValue) ? existingValue : newValue.Trim();
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
