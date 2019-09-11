export class Pagination {
  page: number;
  items: number;
}

export class AffectedClient {
  _id: string;
  applications: AffectedApplication[];
}

export class AffectedClientType {
  client: string;
  applications: AffectedClientApplications;
  affected: AffectedTypes;
}

export class NewClientStatus{
  client:Applications [];
}
export class Applications{
  _id: ErrorAplication;
  errors: ErrorByApp []
}

export class ErrorByApp{
  status_response: string;
  firstDate: Date;
  lastDate: Date;
  count: number;
}
export class ErrorAplication{
  application: string;
  client: string;
  name: string;
  type: string;
}
export class AffectedClientApplications {
  total: number;
  affected: number;
}

export class AffectedTypes {
  sites: number;
  databases: number;
  services: number;
  servicebus: number;
}

export class AffectedApplication {
  events: AppEvent[];
  _id: any;
}

export class ClientStatus {
  _id: string;
  applications: AffectedClientApplications;
}



export class ClientEvents {
  sites: AppEvent[];
  databases: AppEvent[];
  services: AppEvent[];
  servicebus: AppEvent[];
}

export class Client {
  _id: any;
  applications: ClientApp[];
}

export class ClientApp {
  application: string;
  databases: Database[];
  sites: Site[];
  services: Service[];
  servicebus: ServiceBus[];
  administrators: string[];
  events: AppEvent[];
}

export class Application {
  _id: Id;
  client: string;
  application: string;
  description: string;
  sites: Site[];
  databases: Database[];
  services: Service[];
  servicebus: ServiceBus[];
  ownerEmail: string[];
  notifications = true;

  constructor() {
    this.sites = [];
    this.databases = [];
    this.services = [];
    this.servicebus = [];
    this.ownerEmail = [];
  }
}

export class ServiceBus {
  name: string;
  type: string;
  ip: string;
  port: number;
  status: number;
  datetime: Datetime;
}

export class Database {
  name: string;
  type: string;
  ip: string;
  database: string;
  port: number;
  usr: string;
  pwd: string;
  status: number;
  datetime: Datetime;
  query: string;
}

export class Service {
  name: string;
  type: string;
  ip: string;
  port: number;
  url: string;
  method: string;
  status: number;
  datetime: Datetime;
}

export class Site {
  name: string;
  url: string;
  type: string;
  environment: string;
  status: number;
  datetime: Datetime;
}

export class Id {
  '$oid': string;
  'name': string;
}

export class Datetime {
  '$date': number;
}

export class AppEvent {
  name: string;
  last_response: string;
  type: string;
}

export class Catalog {
  _id: Id;
  type: string;
  name: string;
  value: any;
}

export enum ElementType {
  site = 1,
  database = 2,
  service = 3,
  servicebus = 4,
  owners = 5
}
