import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isEqual } from "lodash";
import { Employee } from '../table/table.component'

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.css']
})

export class EmployeeDialogComponent
{
  employee: Employee = {
    id: 0,
    birthDate: '',
    firstName: '',
    lastName: '',
    gender: '',
    hireDate: ''
  };

  form = new FormGroup({
    lastNameControl: new FormControl(),
    firstNameControl: new FormControl(),
    genderControl: new FormControl(),
    birthDateControl: new FormControl(),
    hireDateControl: new FormControl()
  });

  constructor(@Inject(MAT_DIALOG_DATA) protected data: Employee)
  {
    if (data)
      this.employee = structuredClone(data);
  }

  get isUnchanged(): boolean
  {
    return isEqual(this.employee, this.data);
  }
}
