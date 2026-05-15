export interface HomePageSettings {
  id: number;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryButtonLabel: string;
  primaryButtonLink: string;
  secondaryButtonLabel: string;
  secondaryButtonLink: string;
  heroMainImageUrl: string;
  heroMainImagePublicId?: string | null;
  heroSecondaryImageUrl: string;
  heroSecondaryImagePublicId?: string | null;
  heroLogoUrl: string;
  heroLogoPublicId?: string | null;
  galleryImageOneUrl: string;
  galleryImageOnePublicId?: string | null;
  galleryImageOneTitle: string;
  galleryImageTwoUrl: string;
  galleryImageTwoPublicId?: string | null;
  galleryImageTwoTitle: string;
  galleryImageThreeUrl: string;
  galleryImageThreePublicId?: string | null;
  galleryImageThreeTitle: string;
  galleryImageFourUrl: string;
  galleryImageFourPublicId?: string | null;
  galleryImageFourTitle: string;
  galleryImageFiveUrl: string;
  galleryImageFivePublicId?: string | null;
  galleryImageFiveTitle: string;
  galleryImageSixUrl: string;
  galleryImageSixPublicId?: string | null;
  galleryImageSixTitle: string;
  statOneValue: string;
  statOneLabel: string;
  statTwoValue: string;
  statTwoLabel: string;
  statThreeValue: string;
  statThreeLabel: string;
  signatureTitle: string;
  signatureBody: string;
  studioAddress: string;
  studioLatitude: number;
  studioLongitude: number;
  studioEmail: string;
  studioPhone: string;
  showServicesSection: boolean;
  showGallerySection: boolean;
  showReviewsSection: boolean;
  showVisitSection: boolean;
  updatedAt: string;
}

export type UpdateHomePageSettings = Omit<
  HomePageSettings,
  | 'id'
  | 'updatedAt'
  | 'heroMainImagePublicId'
  | 'heroSecondaryImagePublicId'
  | 'heroLogoPublicId'
  | 'galleryImageOnePublicId'
  | 'galleryImageTwoPublicId'
  | 'galleryImageThreePublicId'
  | 'galleryImageFourPublicId'
  | 'galleryImageFivePublicId'
  | 'galleryImageSixPublicId'
>;

export const defaultHomePageSettings: HomePageSettings = {
  id: 1,
  heroEyebrow: 'Brows, lashes, and soft-glam confidence',
  heroTitle: 'Effortless beauty, shaped with intention.',
  heroSubtitle:
    "Kim's Brow & Lash creates polished brows and refined lash looks with a calm studio experience, thoughtful timing, and results designed around your natural features.",
  primaryButtonLabel: 'Explore services',
  primaryButtonLink: '/services',
  secondaryButtonLabel: 'Book an appointment',
  secondaryButtonLink: '/book-appointment',
  heroMainImageUrl: '/brand/kims-brow-lash-client-hero.png',
  heroMainImagePublicId: null,
  heroSecondaryImageUrl: '/brand/kims-brow-lash-service-result.png',
  heroSecondaryImagePublicId: null,
  heroLogoUrl: '/brand/kims-brow-lash-mark.svg',
  heroLogoPublicId: null,
  galleryImageOneUrl: '/brand/kims-brow-lash-client-hero.png',
  galleryImageOnePublicId: null,
  galleryImageOneTitle: "Kim's Brow & Lash Studio",
  galleryImageTwoUrl: '/brand/kims-brow-lash-service-result.png',
  galleryImageTwoPublicId: null,
  galleryImageTwoTitle: 'Brow & Lash Results',
  galleryImageThreeUrl: '/brand/kims-brow-lash-logo.png',
  galleryImageThreePublicId: null,
  galleryImageThreeTitle: 'Luxury Beauty Care',
  galleryImageFourUrl: '/brand/kims-brow-lash-client-hero.png',
  galleryImageFourPublicId: null,
  galleryImageFourTitle: 'Soft Lash Styling',
  galleryImageFiveUrl: '/brand/kims-brow-lash-service-result.png',
  galleryImageFivePublicId: null,
  galleryImageFiveTitle: 'Defined Brows',
  galleryImageSixUrl: '/brand/kims-brow-lash-logo.png',
  galleryImageSixPublicId: null,
  galleryImageSixTitle: 'Natural Enhancements',
  statOneValue: '5★',
  statOneLabel: 'Reviews',
  statTwoValue: '1:1',
  statTwoLabel: 'Styling',
  statThreeValue: 'Soft',
  statThreeLabel: 'Finish',
  signatureTitle: 'Signature detail',
  signatureBody:
    'Clean mapping, balanced brows, and lash looks that feel elevated without feeling heavy.',
  studioAddress: '5150 Yonge St, North York, ON M2N 6L8',
  studioLatitude: 43.768588,
  studioLongitude: -79.4159027,
  studioEmail: 'kimsbrowandlash.ca@gmail.com',
  studioPhone: '',
  showServicesSection: true,
  showGallerySection: true,
  showReviewsSection: true,
  showVisitSection: true,
  updatedAt: new Date().toISOString(),
};
