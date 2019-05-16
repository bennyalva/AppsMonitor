import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogField, DialogFormComponent, FieldType } from 'src/app/components/dialog-form/dialog-form.component';

import { Application, Database, Service, ServiceBus, Site } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';
import { DataService } from '../../services/data.service';

export enum ElementType {
  site = 1,
  database = 2,
  service = 3,
  servicebus = 4
}

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
  elementType = ElementType;

  constructor(private _dataService: DataService, private _consumeService: ConsumeService,
    private _route: ActivatedRoute, private _fb: FormBuilder, private _dialog: MatDialog, private _router: Router) {
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

    this.formApp.get('application').valueChanges.subscribe(val => {
      this.application.application = val;
    });

    this.formApp.get('description').valueChanges.subscribe(val => {
      this.application.description = val;
    });

    if (this.id) {
      this._consumeService.getApplication(this.id).subscribe(res => {
        this.application = res.data;
        this.formApp.patchValue(this.application);
      });
    }
  }

  saveApp() {
    this._dataService.setIsLoadingEvent(true);
    this._consumeService.saveApplication(this.application).subscribe(res => {
      this._dataService.setIsLoadingEvent(false);
      this._dataService.setGeneralNotificationMessage(res.message);
      this._router.navigate(['applications']);
    }, err => {
      this._dataService.setIsLoadingEvent(false);
      this._dataService.setGeneralNotificationMessage(err);
    });
  }

  deleteElement(type: ElementType, element: any) {
    switch (type) {
      case ElementType.site:
        this.application.sites = this.application.sites.filter(x => x !== element);
        break;
    }
  }

  addElement(type: ElementType, element?: any) {
    switch (type) {
      case ElementType.site:
        this.addSite(element);
        break;
      case ElementType.database:
        this.addDatabase(element);
        break;
      case ElementType.service:
        this.addService(element);
        break;
      case ElementType.servicebus:
        this.addServicebus(element);
        break;
    }
  }

  private addSite(item?: any) {
    const title = item ? 'Editar sitio' : 'Agregar sitio';
    const fields: DialogField[] = [
      {
        name: 'name',
        placeholder: 'Nombre',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'url',
        placeholder: 'URL',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'type',
        placeholder: 'Tipo',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'environment',
        placeholder: 'Ambiente',
        type: FieldType.input,
        validators: [Validators.required]
      },
    ];

    const dialogRef = this._dialog.open(DialogFormComponent, {
      panelClass: ['card-dialog'],
      width: '384px',
      data: {
        fields: fields,
        title: title,
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (!item) {
          const site = new Site();
          site.name = value.name;
          site.url = value.url;
          site.type = value.type;
          site.environment = value.environment;
          this.application.sites = this.application.sites.concat(site);
        } else {
          item.name = value.name;
          item.url = value.url;
          item.type = value.type;
          item.environment = value.environment;
        }
      }
    });
  }

  private addDatabase(item?: any) {
    const title = item ? 'Editar base de datos' : 'Agregar base de datos';
    const fields: DialogField[] = [
      {
        name: 'name',
        placeholder: 'Nombre',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'type',
        placeholder: 'Tipo',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'ip',
        placeholder: 'IP',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'database',
        placeholder: 'Base de datos',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'port',
        placeholder: 'Puerto',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'usr',
        placeholder: 'Usuario',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'pwd',
        placeholder: 'Password',
        type: FieldType.input,
        validators: [Validators.required]
      },
    ];

    const dialogRef = this._dialog.open(DialogFormComponent, {
      panelClass: ['card-dialog'],
      width: '384px',
      data: {
        fields: fields,
        title: title,
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (!item) {
          const db = new Database();
          db.name = value.name;
          db.type = value.type;
          db.ip = value.ip;
          db.database = value.database;
          db.port = value.port;
          db.usr = value.usr;
          db.pwd = value.pwd;
          this.application.databases = this.application.databases.concat(db);
        } else {
          item.name = value.name;
          item.type = value.type;
          item.ip = value.ip;
          item.database = value.database;
          item.port = value.port;
          item.usr = value.usr;
          item.pwd = value.pwd;
        }
      }
    });
  }

  private addService(item?: any) {
    const title = item ? 'Editar servicio' : 'Agregar servicio';
    const fields: DialogField[] = [
      {
        name: 'name',
        placeholder: 'Nombre',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'type',
        placeholder: 'Tipo',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'ip',
        placeholder: 'IP',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'port',
        placeholder: 'Puerto',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'url',
        placeholder: 'URL',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'method',
        placeholder: 'Método HTTP',
        type: FieldType.input,
        validators: [Validators.required]
      },
    ];

    const dialogRef = this._dialog.open(DialogFormComponent, {
      panelClass: ['card-dialog'],
      width: '384px',
      data: {
        fields: fields,
        title: title,
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (!item) {
          const service = new Service();
          service.name = value.name;
          service.type = value.type;
          service.ip = value.ip;
          service.port = value.port;
          service.url = value.url;
          service.method = value.method;
          this.application.services = this.application.services.concat(service);
        } else {
          item.name = value.name;
          item.type = value.type;
          item.ip = value.ip;
          item.port = value.port;
          item.url = value.url;
          item.method = value.method;
        }
      }
    });
  }

  private addServicebus(item?: any) {
    const title = item ? 'Editar servicio' : 'Agregar servicio';
    const fields: DialogField[] = [
      {
        name: 'name',
        placeholder: 'Nombre',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'type',
        placeholder: 'Tipo',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'ip',
        placeholder: 'IP',
        type: FieldType.input,
        validators: [Validators.required]
      },
      {
        name: 'port',
        placeholder: 'Puerto',
        type: FieldType.input,
        validators: [Validators.required]
      }
    ];

    const dialogRef = this._dialog.open(DialogFormComponent, {
      panelClass: ['card-dialog'],
      width: '384px',
      data: {
        fields: fields,
        title: title,
        item: item
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (!item) {
          const servicebus = new ServiceBus();
          servicebus.name = value.name;
          servicebus.type = value.type;
          servicebus.ip = value.ip;
          servicebus.port = value.port;
          this.application.servicebus = this.application.servicebus.concat(servicebus);
        } else {
          item.name = value.name;
          item.type = value.type;
          item.ip = value.ip;
          item.port = value.port;
        }
      }
    });
  }
}
