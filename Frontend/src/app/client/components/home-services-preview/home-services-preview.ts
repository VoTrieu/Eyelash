import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-services-preview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-services-preview.html',
  styleUrls: ['./home-services-preview.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeServicesPreview {}
