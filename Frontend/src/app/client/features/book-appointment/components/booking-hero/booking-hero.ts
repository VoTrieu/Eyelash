import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingHero {
  selectedCount = input(0);
  totalDuration = input(0);
  totalPrice = input(0);
}
