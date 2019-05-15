import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Application } from '../model/rest.model';
import { ConsumeService } from '../services/consume.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  id: string;
  title: string;
  application: Application = new Application();
  formApp: FormGroup;

  constructor(private _dataService: DataService, private _consumeService: ConsumeService,
    private _route: ActivatedRoute, private _fb: FormBuilder) {
    this._route.queryParams.subscribe(params => {
      this.id = params.id;
    });

    this.formApp = this._fb.group({
      application: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.title = this.id ? 'Editar aplicación' : 'Agregar aplicación';
  }

}
