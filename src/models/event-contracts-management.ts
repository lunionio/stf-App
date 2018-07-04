export class EventContractsManagement_Contracts {
  contractId: number;
  jobId: number;
  professionalId: number;
  enumContractStatus: string;
  checkIn?: Date;
  checkOut?: Date;
  isPresenceConfirmed: boolean;
  isAbsenceConfirmed: boolean;
  professionalName: string;
  professionalAvatar: string;
  professionalCellPhone: string;
  professionalRating?: number;

  isAbsentButonShow: boolean;
  confirmCheckInButonShow: boolean;
  confirmCheckOutButonShow: boolean;
}

export class EventContractsManagement_Jobs {
  jobId: number;
  eventId: number;
  eventStageId: number;
  serviceId: number;
  dateStart: Date;
  dateEnd: Date;
  serviceName: string;
  serviceGroup: string;
  checkInEnabled: boolean;
  checkOutEnabled: boolean;
  contracts?: EventContractsManagement_Contracts[];
}

export class EventContractsManagement_Stages {
  eventStageId: number;
  companyStageId: number;
  eventId: number;
  stageName: string;
  description: string;
  companyStageName: string;
  defaultStageName: string;
  professionalsConfirmed: number;
  totalProfessionals: number;
  jobs?: EventContractsManagement_Jobs[];

}

export class EventContractsManagement {
  specialContractId?: number;
  enumSpecialContractStatus: string;
  eventId: number;
  companyId: number;
  eventName: string;
  eventDescription: string;
  dateStart: Date;
  dateEnd: Date;
  companyName: string;
  companyAvatar: string;
  companyRating?: number;
  companyCnpj: string;
  companyPhone: string;
  lat: number;
  lng: number;
  address1: string;
  address2: string;
  neighborhood: string;
  zipCode: string;
  cityName: string;
  stateAbbreviation: string;
  eventTime: string;
  stages?: EventContractsManagement_Stages[];
}
