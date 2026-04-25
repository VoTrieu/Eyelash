import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ServicesService } from '../../../core/services/services-service';
import { Service } from '../../../types/service';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule
  ],
  templateUrl: './admin-services.html',
  styleUrls: ['./admin-services.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminServices implements OnInit {
  private servicesService = inject(ServicesService);
  private fb = inject(FormBuilder);

  services = this.servicesService.services;
  
  displayDialog = signal(false);
  isEditing = signal(false);
  editingId = signal<number | null>(null);

  serviceForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    durationInMinutes: [30, [Validators.required, Validators.min(1)]],
    isAvailable: [true]
  });

  ngOnInit() {
    this.servicesService.loadServices().subscribe();
  }

  openNew() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.serviceForm.reset({
      name: '',
      price: 0,
      description: '',
      durationInMinutes: 30,
      isAvailable: true
    });
    this.displayDialog.set(true);
  }

  editService(service: Service) {
    this.isEditing.set(true);
    this.editingId.set(service.id);
    this.serviceForm.patchValue({
      name: service.name,
      price: service.price,
      description: service.description,
      durationInMinutes: service.durationInMinutes,
      isAvailable: service.isAvailable
    });
    this.displayDialog.set(true);
  }

  deleteService(service: Service) {
    if (confirm(`Are you sure you want to delete ${service.name}?`)) {
      this.servicesService.deleteService(service.id).subscribe();
    }
  }

  saveService() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const formValue = this.serviceForm.value as Omit<Service, 'id' | 'created'>;
    
    if (this.isEditing() && this.editingId() !== null) {
      this.servicesService.updateService(this.editingId()!, formValue).subscribe({
        next: () => {
          this.displayDialog.set(false);
        }
      });
    } else {
      this.servicesService.createService(formValue).subscribe({
        next: () => {
          this.displayDialog.set(false);
        }
      });
    }
  }
}
