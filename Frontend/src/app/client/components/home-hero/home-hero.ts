import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomePageSettingsService } from '../../../core/services/home-page-settings-service';
import { defaultHomePageSettings, HomePageSettings } from '../../../types/home-page-settings';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-hero.html',
  styleUrls: ['./home-hero.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHero {
  private homePageSettingsService = inject(HomePageSettingsService);

  settings = input<HomePageSettings>(defaultHomePageSettings);

  imageUrl(url?: string | null) {
    return this.homePageSettingsService.resolveImageUrl(url);
  }
}
