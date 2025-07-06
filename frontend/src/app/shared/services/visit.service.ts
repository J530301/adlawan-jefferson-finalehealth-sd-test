
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Visit } from '../models/visit.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private apiUrl = environment.apiUrl;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getVisitsByPatientId(patientId: string): Observable<Visit[]> {
    this.setLoading(true);
    this.clearError();
    return this.http.get<Visit[]>(`${this.apiUrl}/patients/${patientId}/visits`).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to load visits');
        throw error;
      })
    );
  }

  createVisitForPatient(patientId: string, visit: Omit<Visit, '_id' | 'patientId'>): Observable<Visit> {
    this.setLoading(true);
    this.clearError();
    return this.http.post<Visit>(`${this.apiUrl}/patients/${patientId}/visits`, visit).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to create visit');
        throw error;
      })
    );
  }

  updateVisit(id: string, visit: Partial<Visit>): Observable<Visit> {
    this.setLoading(true);
    this.clearError();
    return this.http.put<Visit>(`${this.apiUrl}/visits/${id}`, visit).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to update visit');
        throw error;
      })
    );
  }

  getVisitById(id: string): Observable<Visit> {
    this.setLoading(true);
    this.clearError();
    return this.http.get<Visit>(`${this.apiUrl}/visits/${id}`).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to load visit');
        throw error;
      })
    );
  }

  deleteVisit(id: string): Observable<void> {
    this.setLoading(true);
    this.clearError();
    return this.http.delete<void>(`${this.apiUrl}/visits/${id}`).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.setLoading(false);
        this.setError('Failed to delete visit');
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
