
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { VisitService } from '../../shared/services/visit.service';
import { PatientService } from '../../shared/services/patient.service';
import { Visit } from '../../shared/models/visit.model';
import { Patient } from '../../shared/models/patient.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.css']
})
export class VisitListComponent implements OnInit, OnDestroy {
  visits: Visit[] = [];
  patient: Patient | null = null;
  patientId: string = '';
  loading = false;
  error: string | null = null;
  displayedColumns: string[] = ['patientId', 'visitDate', 'notes', 'visitType', 'dateCreated', 'dateUpdated', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private visitService: VisitService,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        this.patientId = String(params['patientId'] || '');
        console.log('Loading visits for patient:', this.patientId);
        console.log('Route params object:', params);
        console.log('PatientId type:', typeof this.patientId);
        this.loadPatient();
        return this.visitService.getVisitsByPatientId(this.patientId);
      })
    ).subscribe({
      next: (visits: Visit[]) => {
        console.log('Visits loaded successfully:', visits);
        console.log('PatientId from route:', this.patientId);
        console.log('Patient object:', this.patient);
        if (visits.length > 0) {
          console.log('Sample visit patientId:', visits[0].patientId);
        }
        this.visits = visits.sort((a: Visit, b: Visit) => 
          new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
        );
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        console.error('Error loading visits:', error);
        this.error = `Failed to load visits: ${error.message || error}`;
        this.loading = false;
        this.snackBar.open('Failed to load visits', 'Close', { duration: 3000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPatient(): void {
    this.loading = true;
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

  onAddVisit(): void {
    this.router.navigate(['/visits/patient', this.patientId, 'new']);
  }

  onEditVisit(visit: Visit): void {
    this.router.navigate(['/visits/edit', visit._id]);
  }

  onDeleteVisit(visit: Visit): void {
    if (confirm('Are you sure you want to delete this visit?')) {
      this.visitService.deleteVisit(visit._id!).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.visits = this.visits.filter(v => v._id !== visit._id);
          this.snackBar.open('Visit deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting visit:', error);
          this.snackBar.open('Failed to delete visit', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onBackToPatients(): void {
    this.router.navigate(['/patients']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getPatientIdDisplay(visit: Visit): string {
    
    if (visit.patientId && typeof visit.patientId === 'string') {
      return visit.patientId.slice(-6);
    }
    
    
    if (this.patient?._id && typeof this.patient._id === 'string') {
      return this.patient._id.slice(-6);
    }
    
    
    if (this.patientId && typeof this.patientId === 'string') {
      return this.patientId.slice(-6);
    }
    
    
    return 'N/A';
  }
}
