import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { ListingsProvider } from '../listings/listings';
import { AutoCompleteService } from 'ionic2-auto-complete';

@Injectable()
export class AutoCompleteEducationalInstitutionsProvider implements AutoCompleteService {

  private keywords: Array<string>;
  public blankResult: string; 

  labelAttribute = "educationalInstitutionName";

  constructor(
    public authHttp: AuthHttp,
    private listingsProvider: ListingsProvider) {

    this.keywords = [];
  }

  getResults(keyword: string) {
    if (this.keywords.length) {
      return this.filter(keyword);
    } else {

      return this.listingsProvider.getEducationalInstitutions().subscribe((result) => {
        this.keywords = result.map(item => item.educationalInstitutionName);
        return this.filter(keyword);
      }, (err) => {
        return [];
      });

    }
  }

  filter(keyword: string) {

    let result = this.keywords.filter(item => item.toLowerCase().startsWith(keyword.toLowerCase()));
    if (result == null || result.length == 0) {
      result = new Array() as Array<string>;
      result.push(keyword);
      this.blankResult = keyword;
    }
    return result;
  }
}
