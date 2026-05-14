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
  statOneValue: string;
  statOneLabel: string;
  statTwoValue: string;
  statTwoLabel: string;
  statThreeValue: string;
  statThreeLabel: string;
  signatureTitle: string;
  signatureBody: string;
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
  statOneValue: '5★',
  statOneLabel: 'Reviews',
  statTwoValue: '1:1',
  statTwoLabel: 'Styling',
  statThreeValue: 'Soft',
  statThreeLabel: 'Finish',
  signatureTitle: 'Signature detail',
  signatureBody:
    'Clean mapping, balanced brows, and lash looks that feel elevated without feeling heavy.',
  showServicesSection: true,
  showGallerySection: true,
  showReviewsSection: true,
  showVisitSection: true,
  updatedAt: new Date().toISOString(),
};
