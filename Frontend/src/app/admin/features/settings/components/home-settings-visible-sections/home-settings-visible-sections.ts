import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-home-settings-visible-sections',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, CheckboxModule],
  templateUrl: './home-settings-visible-sections.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSettingsVisibleSections {
  form = input.required<FormGroup>();
}
