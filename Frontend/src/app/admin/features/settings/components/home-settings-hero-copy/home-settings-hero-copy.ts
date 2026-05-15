import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-home-settings-hero-copy',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, InputTextModule, TextareaModule],
  templateUrl: './home-settings-hero-copy.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSettingsHeroCopy {
  form = input.required<FormGroup>();
}
