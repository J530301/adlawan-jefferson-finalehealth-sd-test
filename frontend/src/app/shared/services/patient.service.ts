
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Patient } from '../models/patient.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<Patient[]> {
    this.setLoading(true);
    this.clearError();
    return this.http.get<Patient[]>(this.apiUrl).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to load patients');
        throw error;
      })
    );
  }

  getPatientById(id: string): Observable<Patient> {
    this.setLoading(true);
    this.clearError();
    return this.http.get<Patient>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to load patient');
        throw error;
      })
    );
  }

  createPatient(patient: Omit<Patient, '_id'>): Observable<Patient> {
    this.setLoading(true);
    this.clearError();
    return this.http.post<Patient>(this.apiUrl, patient).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to create patient');
        throw error;
      })
    );
  }

  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient> {
    this.setLoading(true);
    this.clearError();
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to update patient');
        throw error;
      })
    );
  }

  deletePatient(id: string): Observable<void> {
    this.setLoading(true);
    this.clearError();
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to delete patient');
        throw error;
      })
    );
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  private clearError(): void {
    this.errorSubject.next(null);
  }
}
