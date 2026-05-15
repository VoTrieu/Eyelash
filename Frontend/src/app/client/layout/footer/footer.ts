import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomePageSettingsService } from '../../../core/services/home-page-settings-service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  private homePageSettingsService = inject(HomePageSettingsService);

  settings = this.homePageSettingsService.settings;
  emailHref = computed(() => `mailto:${this.settings().studioEmail}`);
  phoneHref = computed(() => `tel:${this.settings().studioPhone.replace(/[^\d+]/g, '')}`);

  ngOnInit() {
    this.homePageSettingsService.loadSettings().subscribe();
  }
}
