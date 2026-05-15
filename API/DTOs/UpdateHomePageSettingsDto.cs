using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

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
    public string GalleryImageOneUrl { get; set; } = "";
    public IFormFile? GalleryImageOne { get; set; }
    public string GalleryImageOneTitle { get; set; } = "";
    public string GalleryImageTwoUrl { get; set; } = "";
    public IFormFile? GalleryImageTwo { get; set; }
    public string GalleryImageTwoTitle { get; set; } = "";
    public string GalleryImageThreeUrl { get; set; } = "";
    public IFormFile? GalleryImageThree { get; set; }
    public string GalleryImageThreeTitle { get; set; } = "";
    public string GalleryImageFourUrl { get; set; } = "";
    public IFormFile? GalleryImageFour { get; set; }
    public string GalleryImageFourTitle { get; set; } = "";
    public string GalleryImageFiveUrl { get; set; } = "";
    public IFormFile? GalleryImageFive { get; set; }
    public string GalleryImageFiveTitle { get; set; } = "";
    public string GalleryImageSixUrl { get; set; } = "";
    public IFormFile? GalleryImageSix { get; set; }
    public string GalleryImageSixTitle { get; set; } = "";
    public string StatOneValue { get; set; } = "";
    public string StatOneLabel { get; set; } = "";
    public string StatTwoValue { get; set; } = "";
    public string StatTwoLabel { get; set; } = "";
    public string StatThreeValue { get; set; } = "";
    public string StatThreeLabel { get; set; } = "";
    public string SignatureTitle { get; set; } = "";
    public string SignatureBody { get; set; } = "";
    public string StudioAddress { get; set; } = "";
    public double StudioLatitude { get; set; }
    public double StudioLongitude { get; set; }
    [EmailAddress]
    public string StudioEmail { get; set; } = "";
    public string StudioPhone { get; set; } = "";
    public bool ShowServicesSection { get; set; } = true;
    public bool ShowGallerySection { get; set; } = true;
    public bool ShowReviewsSection { get; set; } = true;
    public bool ShowVisitSection { get; set; } = true;
}
