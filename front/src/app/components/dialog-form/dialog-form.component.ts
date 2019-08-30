import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export enum FieldType {
  input = 1,
  select = 2,
  password = 3,
  switch = 4
}

export class DialogField {
  name: string;
  placeholder: string;
  validators: Validators[];
  type: FieldType;
  options?: DialogFieldOption[];
}

export class DialogFieldOption {
  value: any;
  text: string;
}

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.css']
})
export class DialogFormComponent implements OnInit {
  fieldType = FieldType;
  title: string;
  fields: DialogField[];
  form: FormGroup;

  constructor(public _dialogRef: MatDialogRef<DialogFormComponent>, @Inject(MAT_DIALOG_DATA) private _data: any,
    private _fb: FormBuilder) {
      console.log('data::: ',this._data)
    this.fields = this._data.fields;
    this.title = this._data.title;

    const controls = this.fields.map(x => {
      return {
        [x.name]: ['', x.validators]
      };
    }).reduce((a, b) => Object.assign(a, b), {});

    this.form = this._fb.group(controls);

    if (this._data.item) {
      this.form.patchValue(this._data.item);
    }
  }

  ngOnInit() {
  }

  dialogOk() {
    this._dialogRef.close(this.form.value);
  }
}
