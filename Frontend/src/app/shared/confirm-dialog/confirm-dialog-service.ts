import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  details?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: string;
  severity?: 'danger' | 'warn' | 'info' | 'success';
}

interface ConfirmDialogState extends Required<Omit<ConfirmDialogOptions, 'details'>> {
  details?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  visible = signal(false);
  state = signal<ConfirmDialogState>({
    title: 'Are you sure?',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    icon: 'pi pi-exclamation-triangle',
    severity: 'danger',
  });

  private resolver: ((value: boolean) => void) | null = null;

  confirm(options: ConfirmDialogOptions) {
    this.state.set({
      title: options.title ?? 'Are you sure?',
      message: options.message,
      details: options.details,
      confirmLabel: options.confirmLabel ?? 'Confirm',
      cancelLabel: options.cancelLabel ?? 'Cancel',
      icon: options.icon ?? 'pi pi-exclamation-triangle',
      severity: options.severity ?? 'danger',
    });

    this.visible.set(true);

    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  accept() {
    this.close(true);
  }

  reject() {
    this.close(false);
  }

  private close(value: boolean) {
    this.visible.set(false);
    this.resolver?.(value);
    this.resolver = null;
  }
}
