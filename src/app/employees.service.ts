import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  baseUrl = "http://localhost:8080/employees";

  constructor(private http : HttpClient) {
  }

  getEmployees(page = 0, size = 15)
  {
    return this.http.get(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  addEmployee(employee: any)
  {
    return this.http.post(`${this.baseUrl}`, employee)
  }

  removeEmployee(id: number)
  {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateEmployee(id: number, employee: any) {
    return this.http.put(`${this.baseUrl}/${id}`, employee);
  }
}
