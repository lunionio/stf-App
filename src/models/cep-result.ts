import { City } from './city';

export class CepResult {
  zipCode: string;
  address: string;
  neighborhood: string;
  stateId: number;
  cityId: number;
  cities: [City];
}
