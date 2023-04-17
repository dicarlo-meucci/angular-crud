import { Component } from '@angular/core';
import { EmployeesService } from '../employees.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialogComponent } from '../employee-dialog/employee-dialog.component';

export interface Employee
{
  id: number,
  firstName: String,
  lastName: String,
  gender: String,
  birthDate: String,
  hireDate: String,
}

export interface Employees
{
  employees: Employee[]
}

export interface DataObject
{
  _embedded: Employees,
  _links: Link,
  page: Page,
}

export interface Link
{
  first: LinkPart,
  last: LinkPart,
  next: LinkPart,
  prev: LinkPart,
  self: LinkPart,
}

export interface LinkPart
{
  href: String,
}

export interface Page
{
  number: number,
  size: number,
  totalElements: number,
  totalPages: number,
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent
{
  pageCount = 0;
  data: DataObject | undefined;
  columns: String[] = ["id", "firstName", "lastName", "gender", "birthDate", "hireDate", "actions"]

  constructor(private employees: EmployeesService, private dialog: MatDialog)
  {
    this.loadEmployees(this.pageCount)
  }

  firstPage()
  {
    const url = this.data?._links.first.href
    const urlParams = new URLSearchParams(url?.split('?')[1]);
    const pageNumber = parseInt(urlParams.get('page') as any)
    this.loadEmployees(pageNumber)
    this.pageCount = pageNumber
  }

  prevPage()
  {
    if (this.pageCount == 0)
      return

    const url = this.data?._links.prev.href
    const urlParams = new URLSearchParams(url?.split('?')[1]);
    const pageNumber = parseInt(urlParams.get('page') as any)
    this.loadEmployees(pageNumber)
    this.pageCount = pageNumber
  }

  nextPage()
  {
    if (this.data?.page.totalPages == this.pageCount + 1)
      return

    const url = this.data?._links.next.href
    const urlParams = new URLSearchParams(url?.split('?')[1]);
    const pageNumber = parseInt(urlParams.get('page') as any)
    this.loadEmployees(pageNumber)
    this.pageCount = pageNumber
  }

  lastPage()
  {
    const url = this.data?._links.last.href
    const urlParams = new URLSearchParams(url?.split('?')[1]);
    const pageNumber = parseInt(urlParams.get('page') as any)
    this.loadEmployees(pageNumber)
    this.pageCount = pageNumber
  }

  async lastEmployeeID() {
    const url = this.data?._links.last.href
    const urlParams = new URLSearchParams(url?.split('?')[1]);
    const pageNumber = parseInt(urlParams.get('page') as any)
    this.employees.getEmployees(pageNumber).subscribe(
      data =>
      {
        let length = (data as DataObject)._embedded.employees.length;
        return (data as DataObject)._embedded.employees[length].id
      }
    )
  }

  loadEmployees(page: number)
  {
    this.employees.getEmployees(page).subscribe(
      data => this.data = data as DataObject
    )
  }

  fireEmployee(id: number)
  {
    if (confirm("Are you sure you want to fire this employee ?"))
    {
      this.employees.removeEmployee(id).subscribe(
        _ => this.loadEmployees(this.pageCount),
        _ => alert("Failed to fire the employee")
      )
    }
  }

  showNewDialog()
  {
    const ref = this.dialog.open(EmployeeDialogComponent);
    ref.afterClosed().subscribe(async data =>
    {
      if (!data)
        return;
      data.id = await this.lastEmployeeID()
      this.employees.addEmployee(data).subscribe(
        _ => this.loadEmployees(this.pageCount),
        _ => alert("Failed to add the employee")
      )
    })
  }

  showEditDialog(employee: Employee)
  {
    const { id } = employee;
    const ref = this.dialog.open(EmployeeDialogComponent, { data: employee });

    ref.afterClosed().subscribe(data =>
    {
      if (!data)
        return;

      this.employees.updateEmployee(id, data).subscribe(
        _ => this.loadEmployees(this.pageCount),
        _ => alert('Failed to edit the employee')
      )
    })
  }
}