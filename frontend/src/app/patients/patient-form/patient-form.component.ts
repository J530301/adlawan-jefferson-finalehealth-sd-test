
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PatientService } from '../../shared/services/patient.service';
import { Patient } from '../../shared/models/patient.model';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit, OnDestroy {
  patientForm: FormGroup;
  isEditMode = false;
  patientId: string | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.patientForm = this.createForm();
  }

  ngOnInit(): void {
    this.subscribeToServices();
    this.checkRouteParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToServices(): void {
    this.patientService.loading$.pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);

    this.patientService.error$.pipe(takeUntil(this.destroy$))
      .subscribe(error => this.error = error);
  }

  private checkRouteParams(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.patientId;

    if (this.isEditMode && this.patientId) {
      this.loadPatient(this.patientId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{10,}$/)]],
      dob: [this.getTodayInYYYYMMDD(), Validators.required],
      address: ['', Validators.required],
      emergencyContact: [''],
      medicalHistory: ['']
    });
  }

  private loadPatient(id: string): void {
    this.patientService.getPatientById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patient) => {
          this.patientForm.patchValue({
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phoneNumber: patient.phoneNumber,
            dob: patient.dob ? this.formatDateToYYYYMMDD(new Date(patient.dob)) : '', 
            address: patient.address || '',
            emergencyContact: patient.emergencyContact || '',
            medicalHistory: patient.medicalHistory || ''
          });
        },
        error: (error) => {
          console.error('Error loading patient:', error);
          this.router.navigate(['/patients']);
        }
      });
  }

  onSubmit(): void {
    if (this.patientForm.valid && !this.submitting) {
      this.submitting = true;
      const formValue = this.patientForm.value;
      const patientData: Omit<Patient, '_id'> = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        dob: formValue.dob,
        address: formValue.address,
        emergencyContact: formValue.emergencyContact || undefined,
        medicalHistory: formValue.medicalHistory || undefined
      };

      if (this.isEditMode && this.patientId) {
        this.updatePatient(this.patientId, patientData);
      } else {
        this.createPatient(patientData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createPatient(patientData: Omit<Patient, '_id'>): void {
    this.patientService.createPatient(patientData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/patients']);
        },
        error: (error) => {
          this.submitting = false;
          console.error('Error creating patient:', error);
        }
      });
  }

  private updatePatient(id: string, patientData: Omit<Patient, '_id'>): void {
    this.patientService.updatePatient(id, patientData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/patients']);
        },
        error: (error) => {
          this.submitting = false;
          console.error('Error updating patient:', error);
        }
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.patientForm.controls).forEach(key => {
      this.patientForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.patientForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }

  clearError(): void {
    this.error = null;
  }

  
  getTodayInYYYYMMDD(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
