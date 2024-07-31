import {Component, ElementRef, input, model, output, ViewChild, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {toObservable} from "@angular/core/rxjs-interop";
import {Observable, tap} from "rxjs";
import {isValidDate} from "rxjs/internal/util/isDate";
import {NumberToDateString} from "../utility/number-to-date-string.utility";
import {faCalendar, faCalendarDays} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-calendar-input',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent],
  templateUrl: './calendar-input.component.html',
  styleUrl: './calendar-input.component.scss',
})
export class CalendarInputComponent {
  readonly calendarIcon = faCalendarDays

  mode = input<"single" | "range">("single")
  startDay = model<string | undefined>(undefined)
  startMonth = model<string | undefined>(undefined)
  startYear = model<string | undefined>(undefined)
  selectedStartDate = model<Date | undefined>()


  endDay = model<string | undefined>(undefined)
  endMonth = model<string | undefined>(undefined)
  endYear = model<string | undefined>(undefined)
  selectedEndDate = model<Date | undefined>()

  @ViewChild('inputWrapperElement') inputWrapperElement: ElementRef | undefined;
  inputClicked = output<ElementRef | undefined>()


  constructor() {
    this.listenSelectedStartDateChange().subscribe()
    this.listenSelectedEndDateChange().subscribe()
  }

  inputClickedHandler() {
    this.inputClicked.emit(this.inputWrapperElement)
  }

  focusOut(valueSignal: WritableSignal<string | undefined>, type: 'day' | 'month' | 'year') {
    let valueNumber = Number(valueSignal());

    if(valueNumber < 10) {
      valueSignal.set('0' + valueNumber.toString())
    }

    if(type === 'day') {
      if(valueNumber >= 31) {
        valueSignal.set('31')
      }
    }

    if(type === 'month') {
      if (valueNumber >= 12) {
        valueSignal.set('12')
      }
    }

    if(valueNumber <= 0) {
      valueSignal.set('01')
    }

    this.selectStartDate();
  }

  onStartDateChange() {
    this.selectStartDate();
  }

  onEndDateChange() {
    this.selectEndDate();
  }

  selectStartDate() {
    let year = Number(this.startYear())
    let month = Number(this.startMonth())
    let day = Number(this.startDay())
    let date = new Date(year, month - 1, day)

    this.selectedStartDate.set(new Date(date))
  }

  selectEndDate() {
    let year = Number(this.endYear())
    let month = Number(this.endMonth())
    let day = Number(this.endDay())
    let date = new Date(year, month - 1, day)

    this.selectedEndDate.set(new Date(date))
  }

  listenSelectedStartDateChange(): Observable<Date | undefined> {
    return toObservable(this.selectedStartDate)
        .pipe(
           tap((data)=>{
             if(isValidDate(data)){
               this.setSelectedStartDateToInputs(data)
             } else {
               this.startDay.set(undefined)
               this.startMonth.set(undefined)
               this.startYear.set(undefined)
             }
           })
        )
  }

  listenSelectedEndDateChange(): Observable<Date | undefined> {
    return toObservable(this.selectedEndDate)
        .pipe(
           tap((data)=>{
             if(isValidDate(data)){
               this.setSelectedEndDateToInputs(data)
             } else {
               this.endDay.set(undefined)
               this.endMonth.set(undefined)
               this.endYear.set(undefined)
             }
           })
        )
  }

  setSelectedStartDateToInputs(selectedDate: Date){
    let year = selectedDate.getFullYear()
    let month = selectedDate.getMonth() + 1;
    let day = selectedDate.getDate()

    this.startYear.set(NumberToDateString(year))
    this.startMonth.set(NumberToDateString(month))
    this.startDay.set(NumberToDateString(day))
  }

  setSelectedEndDateToInputs(selectedDate: Date){
    let year = selectedDate.getFullYear()
    let month = selectedDate.getMonth() + 1;
    let day = selectedDate.getDate()

    this.endYear.set(NumberToDateString(year))
    this.endMonth.set(NumberToDateString(month))
    this.endDay.set(NumberToDateString(day))
  }
}
