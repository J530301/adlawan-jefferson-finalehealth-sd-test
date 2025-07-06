
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { VisitService } from '../../shared/services/visit.service';
import { PatientService } from '../../shared/services/patient.service';
import { Visit } from '../../shared/models/visit.model';
import { Patient } from '../../shared/models/patient.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrls: ['./visit-form.component.css']
})
export class VisitFormComponent implements OnInit, OnDestroy {
  visitForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  visitId: string | null = null;
  patientId: string | null = null;
  patient: Patient | null = null;

  
  visitTypeOptions = ['Home', 'Telehealth', 'Clinic'];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private visitService: VisitService,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {
    this.visitForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.visitId = params['id'];
      this.patientId = params['patientId'];
      this.isEditMode = !!this.visitId;

      if (this.patientId) {
        this.loadPatient();
      }

      if (this.isEditMode && this.visitId) {
        this.loadVisit();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): FormGroup {
    return this.fb.group({
      visitDate: [this.getTodayInYYYYMMDD(), [Validators.required]],
      visitType: ['', [Validators.required]],
      notes: ['']
    });
  }

  loadPatient(): void {
    if (!this.patientId) return;

    this.patientService.getPatientById(this.patientId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (patient) => {
        this.patient = patient;
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.snackBar.open('Failed to load patient information', 'Close', { duration: 3000 });
      }
    });
  }

  loadVisit(): void {
    if (!this.visitId) return;

    this.loading = true;
    this.visitService.getVisitById(this.visitId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (visit: Visit) => {
        this.patientId = visit.patientId;
        this.loadPatient();
        
        this.visitForm.patchValue({
          visitDate: this.formatDateToYYYYMMDD(new Date(visit.visitDate)),
          visitType: visit.visitType,
          notes: visit.notes || ''
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading visit:', error);
        this.loading = false;
        this.snackBar.open('Failed to load visit', 'Close', { duration: 3000 });
        this.onCancel();
      }
    });
  }

  onSubmit(): void {
    if (this.visitForm.valid && !this.submitting) {
      this.submitting = true;
      const formValue = this.visitForm.value;
      
      console.log('Form submission started:', {
        formValue,
        patientId: this.patientId,
        isEditMode: this.isEditMode
      });
      
      const visitData: Omit<Visit, '_id' | 'patientId' | 'createdAt' | 'updatedAt'> = {
        visitDate: this.parseFormDateToISO(formValue.visitDate),
        visitType: formValue.visitType,
        notes: formValue.notes || undefined
      };

      console.log('Visit data to send:', visitData);

      const operation = this.isEditMode && this.visitId
        ? this.visitService.updateVisit(this.visitId, visitData)
        : this.visitService.createVisitForPatient(this.patientId!, visitData);

      operation.pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          console.log('Visit operation successful:', response);
          this.submitting = false;
          this.snackBar.open(
            `Visit ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.onCancel();
        },
        error: (error) => {
          console.error('Error saving visit:', error);
          this.submitting = false;
          this.snackBar.open(
            `Failed to ${this.isEditMode ? 'update' : 'create'} visit: ${error.message || error}`,
            'Close',
            { duration: 5000 }
          );
        }
      });
    } else {
      console.log('Form is invalid or already submitting:', {
        valid: this.visitForm.valid,
        submitting: this.submitting,
        errors: this.visitForm.errors,
        formValue: this.visitForm.value
      });
    }
  }

  onCancel(): void {
    if (this.patientId) {
      this.router.navigate(['/visits/patient', this.patientId]);
    } else {
      this.router.navigate(['/patients']);
    }
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString();
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

  parseFormDateToISO(dateValue: string): string {
    if (!dateValue) {
      return new Date().toISOString();
    }
    
    const date = new Date(dateValue + 'T00:00:00.000Z');
    return date.toISOString();
  }
}
