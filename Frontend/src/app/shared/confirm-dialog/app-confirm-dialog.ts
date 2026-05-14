import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogService } from './confirm-dialog-service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './app-confirm-dialog.html',
  styleUrls: ['./app-confirm-dialog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppConfirmDialog {
  protected confirmDialogService = inject(ConfirmDialogService);

  protected iconClass = computed(() => {
    const severity = this.confirmDialogService.state().severity;

    return {
      danger: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300',
      warn: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      info: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
      success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    }[severity];
  });

  protected confirmSeverity = computed(() => {
    const severity = this.confirmDialogService.state().severity;
    return severity === 'danger' ? 'danger' : severity === 'warn' ? 'warn' : undefined;
  });
}
