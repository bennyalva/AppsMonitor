export class Pagination {
  page: number;
  items: number;
}

export class AffectedClient {
  client: string;
  applications: AffectedApplication[];
  total: number;
  affected: number;
}

export class AffectedClientType {
  client: string;
  applications: AffectedClientApplications;
  affected: AffectedTypes;
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
  name: string;
  events: AppEvent[];
}

export class ClientStatus {
  client: string;
  applications: AffectedClientApplications;
  types: AffectedTypes;
  events: ClientEvents;
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
  _id: Id;
  application: Id;
  client: string;
  datetime: Datetime;
  name: string;
  status: boolean;
  status_response: string;
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
