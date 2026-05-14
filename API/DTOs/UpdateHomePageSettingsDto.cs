using Microsoft.AspNetCore.Http;

namespace API.DTOs;

public class UpdateHomePageSettingsDto
{
    public string HeroEyebrow { get; set; } = "";
    public string HeroTitle { get; set; } = "";
    public string HeroSubtitle { get; set; } = "";
    public string PrimaryButtonLabel { get; set; } = "";
    public string PrimaryButtonLink { get; set; } = "";
    public string SecondaryButtonLabel { get; set; } = "";
    public string SecondaryButtonLink { get; set; } = "";
    public string HeroMainImageUrl { get; set; } = "";
    public IFormFile? HeroMainImage { get; set; }
    public string HeroSecondaryImageUrl { get; set; } = "";
    public IFormFile? HeroSecondaryImage { get; set; }
    public string HeroLogoUrl { get; set; } = "";
    public IFormFile? HeroLogoImage { get; set; }
    public string StatOneValue { get; set; } = "";
    public string StatOneLabel { get; set; } = "";
    public string StatTwoValue { get; set; } = "";
    public string StatTwoLabel { get; set; } = "";
    public string StatThreeValue { get; set; } = "";
    public string StatThreeLabel { get; set; } = "";
    public string SignatureTitle { get; set; } = "";
    public string SignatureBody { get; set; } = "";
    public bool ShowServicesSection { get; set; } = true;
    public bool ShowGallerySection { get; set; } = true;
    public bool ShowReviewsSection { get; set; } = true;
    public bool ShowVisitSection { get; set; } = true;
}
