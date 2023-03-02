import {Component} from '@angular/core';
import {MemberInterface} from "./lib/interfaces/member.interface";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {HolidayExpensesService} from "./lib/services/holiday-expenses.service";
import {take} from "rxjs";
import {ExpensesResponseInterface} from "./lib/interfaces/expenses-response.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public memberForm: UntypedFormGroup;
  public dataSource: MemberInterface[] = [];
  public displayedColumns: string[] = ['name', 'amount'];

  public displayedPayoutColumns: string[] = ['owes', 'owed', 'amount'];
  public expensesData: ExpensesResponseInterface | null = null;
  public isLoading: boolean = false;

  constructor(private expensesService: HolidayExpensesService) {
    this.memberForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, Validators.required),
      amount: new UntypedFormControl(null, Validators.required),
    });
  }

  /**
   * Add new member to the table
   */
  addMember() {
    const newMember = {...this.memberForm.value};
    this.memberForm.reset();

    if (newMember.name) {
      this.dataSource = [...this.dataSource, newMember];
    }
  }

  /**
   * Fetch Holiday Expenses Calculation
   */
  settleUp() {
    if (this.dataSource && this.dataSource.length) {
      this.isLoading = true;
      this.expensesService.getHolidayExpensesCalculation(this.dataSource)
        .pipe(take(1))
        .subscribe((data: ExpensesResponseInterface) => {
          this.expensesData = data;

          this.isLoading = false;
        })
    }
  }

  /**
   * Reset data
   */
  reset() {
    this.dataSource = [];
    this.expensesData = null;
  }
}
