
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { PatientService } from '../../shared/services/patient.service';
import { VisitService } from '../../shared/services/visit.service';
import { Patient } from '../../shared/models/patient.model';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private patientService: PatientService,
    private visitService: VisitService,
    private router: Router
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.filterPatients(searchTerm);
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.subscribeToServices();
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

  loadPatients(): void {
    this.patientService.getAllPatients().pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patients) => {
          this.patients = patients;
          this.loadVisitCounts();
          this.filterPatients(this.searchTerm);
        },
        error: (error) => {
          console.error('Error loading patients:', error);
        }
      });
  }

  private loadVisitCounts(): void {
    this.patients.forEach(patient => {
      if (patient._id) {
        this.visitService.getVisitsByPatientId(patient._id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (visits) => {
              patient.totalVisits = visits.length;
            },
            error: (error) => {
              console.error('Error loading visit count:', error);
              patient.totalVisits = 0;
            }
          });
      }
    });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  private filterPatients(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredPatients = [...this.patients];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredPatients = this.patients.filter(patient =>
        patient.firstName.toLowerCase().includes(term) ||
        patient.lastName.toLowerCase().includes(term) ||
        patient.email.toLowerCase().includes(term)
      );
    }
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPatients.length / this.pageSize);
    this.currentPage = 1;
  }

  get paginatedPatients(): Patient[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPatients.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  addPatient(): void {
    this.router.navigate(['/patients/new']);
  }

  editPatient(id: string): void {
    this.router.navigate(['/patients/edit', id]);
  }

  viewVisits(patientId: string): void {
    
    this.router.navigate(['/visits/patient', patientId]);
  }

  deletePatient(patient: Patient): void {
    if (patient._id && confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`)) {
      this.patientService.deletePatient(patient._id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadPatients();
          },
          error: (error) => {
            console.error('Error deleting patient:', error);
          }
        });
    }
  }

  clearError(): void {
    this.error = null;
  }

  calculateAge(dateOfBirth: string | Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getPageNumbers(): number[] {
    const maxPagesToShow = 5;
    const pages: number[] = [];
    
    if (this.totalPages <= maxPagesToShow) {
      
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      
      let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
      
      
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  
  Math = Math;
}
