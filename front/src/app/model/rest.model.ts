export interface Application {
  _id: Id;
  application: string;
  description: string;
  sites: Site[];
  databases: Database[];
  services: Service[];
  servicebus: ServiceBus[];
}

export interface ServiceBus {
  name: string;
  type: string;
  ip: string;
  port: number;
  status: number;
  datetime: Datetime;
}

export interface Database {
  name: string;
  type: string;
  ip: string;
  database: string;
  port: number;
  usr: string;
  pwd: string;
  status: number;
  datetime: Datetime;
}

export interface Service {
  name: string;
  type: string;
  ip: string;
  port: number;
  url: string;
  method: string;
  status: number;
  datetime: Datetime;
}

export interface Site {
  name: string;
  url: string;
  type: string;
  environment: string;
  status: number;
  datetime: Datetime;
}

export interface Id {
  '$oid': string;
}

export interface Datetime {
  '$date': number;
}
