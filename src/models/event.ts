export enum EventFilter {
    Oportunidades_Disponiveis = 1,
    Oportunidades_Recusadas = 2,
    Oportunidades_Favoritas = 3,
    Oportunidades_Convites = 7,
    Eventos_Agendados = 4,
    Eventos_Realizados = 5,
    Eventos_EmAnalise = 6
}

export class Event {
  eventId: number;
  companyAvatar: string;
  name: string;
  companyName: string;
  companyRate: number;
  dateStart: Date;
  cityName: string;
  stateAbbreviation: string;
  eventTime: string;
  isFavorite: boolean;
  contractId: number;
  checkIn: Date;
  checkOut: Date;
  checkInEnabled: boolean;
  checkOutEnabled: boolean;
  jobs: [
    {
      jobId: number,
      budget: number,
      serviceName: string,
      serviceGroup: string,
      isRated: boolean
    }
  ]
}
