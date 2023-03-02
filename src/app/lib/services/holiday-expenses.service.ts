import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MemberInterface} from "../interfaces/member.interface";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {ExpensesResponseInterface} from "../interfaces/expenses-response.interface";

@Injectable({
  providedIn: 'root'
})
export class HolidayExpensesService {

  constructor(private http: HttpClient) {}

  /**
   * Request holiday expenses calculation
   * @param expenses
   */
  getHolidayExpensesCalculation(expenses: MemberInterface[]): Observable<ExpensesResponseInterface> {
    return this.http.post<ExpensesResponseInterface>(`${environment.API_URL}/payouts`, {expenses: expenses});
  }
}
