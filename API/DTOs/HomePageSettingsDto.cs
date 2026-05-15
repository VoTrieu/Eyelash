namespace API.DTOs;

public class HomePageSettingsDto
{
    public int Id { get; set; }
    public string HeroEyebrow { get; set; } = "";
    public string HeroTitle { get; set; } = "";
    public string HeroSubtitle { get; set; } = "";
    public string PrimaryButtonLabel { get; set; } = "";
    public string PrimaryButtonLink { get; set; } = "";
    public string SecondaryButtonLabel { get; set; } = "";
    public string SecondaryButtonLink { get; set; } = "";
    public string HeroMainImageUrl { get; set; } = "";
    public string? HeroMainImagePublicId { get; set; }
    public string HeroSecondaryImageUrl { get; set; } = "";
    public string? HeroSecondaryImagePublicId { get; set; }
    public string HeroLogoUrl { get; set; } = "";
    public string? HeroLogoPublicId { get; set; }
    public string GalleryImageOneUrl { get; set; } = "";
    public string? GalleryImageOnePublicId { get; set; }
    public string GalleryImageOneTitle { get; set; } = "";
    public string GalleryImageTwoUrl { get; set; } = "";
    public string? GalleryImageTwoPublicId { get; set; }
    public string GalleryImageTwoTitle { get; set; } = "";
    public string GalleryImageThreeUrl { get; set; } = "";
    public string? GalleryImageThreePublicId { get; set; }
    public string GalleryImageThreeTitle { get; set; } = "";
    public string GalleryImageFourUrl { get; set; } = "";
    public string? GalleryImageFourPublicId { get; set; }
    public string GalleryImageFourTitle { get; set; } = "";
    public string GalleryImageFiveUrl { get; set; } = "";
    public string? GalleryImageFivePublicId { get; set; }
    public string GalleryImageFiveTitle { get; set; } = "";
    public string GalleryImageSixUrl { get; set; } = "";
    public string? GalleryImageSixPublicId { get; set; }
    public string GalleryImageSixTitle { get; set; } = "";
    public string StatOneValue { get; set; } = "";
    public string StatOneLabel { get; set; } = "";
    public string StatTwoValue { get; set; } = "";
    public string StatTwoLabel { get; set; } = "";
    public string StatThreeValue { get; set; } = "";
    public string StatThreeLabel { get; set; } = "";
    public string SignatureTitle { get; set; } = "";
    public string SignatureBody { get; set; } = "";
    public bool ShowServicesSection { get; set; }
    public bool ShowGallerySection { get; set; }
    public bool ShowReviewsSection { get; set; }
    public bool ShowVisitSection { get; set; }
    public DateTime UpdatedAt { get; set; }
}
