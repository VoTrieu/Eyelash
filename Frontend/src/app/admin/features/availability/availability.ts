import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AvailabilityService } from '../../../core/services/availability-service';
import { ToastService } from '../../../core/services/toast-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentAvailabilityFormValue, AppointmentAvailabilityQueryParams, AppointmentAvalabilityBlock, AvalabilityBlockType } from '../../../types/availability';
import { finalize } from 'rxjs';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Dialog } from "primeng/dialog";
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { toDateFromTimeString, toDateOnly, toTimeOnly } from '../../../shared/helpers/date-time-helper';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog-service';

@Component({
  selector: 'app-availability',
  imports: [TableModule, ReactiveFormsModule, CommonModule, 
    Dialog, SelectModule, CheckboxModule, ButtonModule, InputTextModule, TextareaModule, DatePickerModule],
  templateUrl: './availability.html',
  styleUrl: './availability.css',
})
export class Availability implements OnInit{
  private availabilityService = inject(AvailabilityService);
  private toasteService = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);
  private fb = inject(FormBuilder);

  availabilityBlocks = this.availabilityService.availabilityBlocks;
  totalRecords = computed(() => this.availabilityService.pagination()?.totalItems ?? 0);
  loading = signal(false);
  saving = signal(false);
  editorVisible = signal(false);
  editingBlock = signal<AppointmentAvalabilityBlock | null>(null);

  rows = 10;
  first = 0;
  sortBy = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';
  defaultDate = new Date();
 

  typeOptions: {label: string, value: AvalabilityBlockType}[] = [
    { label: 'Working', value: 'Working' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Closed', value: 'Closed' },
  ];

  filterForm = this.fb.group({
    fromDate: [''],
    toDate: [''],
  });

  editorForm = this.fb.group({
    date: [this.defaultDate, Validators.required],
    startTime: [null as Date | null],                      
    endTime: [null as Date | null],  
    notes: [''],
    type: ['Blocked' as AvalabilityBlockType],
    isActive: [true]
  })

  ngOnInit(): void {
    this.loadAvailabilityBlocks();
  }

  loadAvailabilityBlocks(params: Partial<AppointmentAvailabilityQueryParams> = {}){
    this.loading.set(true);

    this.availabilityService.loadAvailabilityBlocks({
      pageNumber: Math.floor(this.first / this.rows) + 1,
      pageSize: this.rows,
      fromDate: toDateOnly(this.filterForm.value.fromDate),
      toDate: toDateOnly(this.filterForm.value.toDate),
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      ...params
    })
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      error: () => this.toasteService.showError('Could not load availability blocks')
     })
  }

  onTableLazyLoad(event: TableLazyLoadEvent){
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;

    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
    this.sortBy = sortField || this.sortBy;
    this.sortDirection = event.sortOrder === -1 ? 'desc' : 'asc';

    this.loadAvailabilityBlocks();
  }

  applyFilters(){
    this.first = 0;
    this.loadAvailabilityBlocks();
  }

  clearFilters(){
    this.filterForm.reset({ fromDate: '', toDate: '' });
    this.first = 0;
    this.loadAvailabilityBlocks();
  }

  openCreate(){
    this.editingBlock.set(null);
    this.editorVisible.set(true);
    this.editorForm.reset({
      date: new Date(),
      startTime: null,
      endTime: null,
      notes: '',
      type: 'Blocked',
      isActive: true
    }); 
  }

  openEdit(block: AppointmentAvalabilityBlock){
    this.editingBlock.set(block);
    this.editorVisible.set(true);
    this.editorForm.patchValue({
      date: new Date(block.date),
      startTime: toDateFromTimeString(block.startTime),
      endTime: toDateFromTimeString(block.endTime),
      notes: block.notes ?? '',
      type: block.type,
      isActive: block.isActive,
    });
    this.editorForm.markAsPristine();
  }

  save(){
    if(this.editorForm.invalid){
      this.editorForm.markAllAsTouched();
      return;
    }

    const formValue = this.editorForm.getRawValue();

    if(formValue.startTime && formValue.endTime && formValue.startTime >= formValue.endTime){
      this.toasteService.showError('Start time must be before end time');
      return;
    }

    const value: AppointmentAvailabilityFormValue = {
      date: toDateOnly(formValue.date) ?? "",
      startTime: toTimeOnly(formValue.startTime),
      endTime: toTimeOnly(formValue.endTime),
      notes: formValue.notes,
      type: formValue.type ?? 'Blocked',
      isActive: formValue.isActive ?? true,
    };


    this.saving.set(true);

    const editing = this.editingBlock();
    const request = editing 
      ? this.availabilityService.updateAvailabilityBlock(editing.id, value) 
      : this.availabilityService.createAvailabilityBlock(value);

      request.pipe(finalize(() => this.saving.set(false))).subscribe({
        next: () => {
          this.editorVisible.set(false);
          this.loadAvailabilityBlocks();
          this.toasteService.showSuccess(editing ? 'Availability block updated' : 'Availability block created' );
        },
        error: () => this.toasteService.showError('Could not save availability block')  
      });
  }

  async delete(block: AppointmentAvalabilityBlock){
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Delete availability block?',
      message: `Delete the ${block.type.toLowerCase()} block for ${block.date}?`,
      details: 'This removes the availability rule and may change which appointment slots clients can request.',
      confirmLabel: 'Delete block',
      severity: 'danger',
      icon: 'pi pi-trash',
    });

    if (!confirmed) return;

    this.availabilityService.deleteAvailabilityBlock(block.id).subscribe({
      next: () => {
        this.loadAvailabilityBlocks();
        this.toasteService.showSuccess('Availability block deleted');
      },
      error: () => {
        this.toasteService.showError('Could not delete availability block');  
      }
    });
  }



}
