import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Map } from '../../../shared/map/map';

@Component({
  selector: 'app-home-visit-section',
  standalone: true,
  imports: [Map, RouterLink],
  templateUrl: './home-visit-section.html',
  styleUrls: ['./home-visit-section.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeVisitSection {}
