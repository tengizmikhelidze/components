import {Component, effect, ElementRef, input, model, output, ViewChild, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NumberToDateString} from "../utility/number-to-date-string.utility";
import {isValidDate} from "rxjs/internal/util/isDate";
import {Observable, tap} from "rxjs";
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-calendar-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-input.component.html',
  styleUrl: './calendar-input.component.scss',
})
export class CalendarInputComponent {

  mode = input<"single" | "range">("single")
  startDay = model<string | undefined>(undefined)
  startMonth = model<string | undefined>(undefined)
  startYear = model<string | undefined>(undefined)
  selectedStartDate = input.required<Date | undefined>()
  selectedStartDateOutput = output<Date | undefined>({
    alias: 'selectedStartDate'
  })


  endDay = model<string | undefined>(undefined)
  endMonth = model<string | undefined>(undefined)
  endYear = model<string | undefined>(undefined)
  selectedEndDate = input.required<Date | undefined>()
  selectedEndDateOutput = output<Date | undefined>({
    alias: 'selectedEndDate'
  })

  @ViewChild('inputWrapperElement') inputWrapperElement: ElementRef | undefined;
  inputClicked = output<ElementRef | undefined>()

  constructor() {
    this.listenSelectedStartDateChange().subscribe()
    this.listenSelectedEndDateChange().subscribe()
  }

  inputClickedHandler(startDayInput: HTMLInputElement) {
    if(this.mode() !== 'range') {
      startDayInput.focus()
    }
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

    this.selectedStartDateOutput.emit(new Date(date))
  }

  selectEndDate() {
    let year = Number(this.endYear())
    let month = Number(this.endMonth())
    let day = Number(this.endDay())
    let date = new Date(year, month - 1, day)

    this.selectedEndDateOutput.emit(new Date(date))
  }

  listenSelectedStartDateChange(): Observable<Date | undefined> {
    return toObservable(this.selectedStartDate)
        .pipe(
            tap((data)=>{
              this.setSelectedStartDateToInputs(data)
            })
        )
  }

  listenSelectedEndDateChange(): Observable<Date | undefined> {
    return toObservable(this.selectedEndDate)
        .pipe(
            tap((data)=>{
              this.setSelectedEndDateToInputs(data)
            })
        )
  }

  setSelectedStartDateToInputs(selectedDate: Date | undefined){
    if(isValidDate(selectedDate)) {
      let year = selectedDate.getFullYear()
      let month = selectedDate.getMonth() + 1;
      let day = selectedDate.getDate()

      this.startYear.set(NumberToDateString(year))
      this.startMonth.set(NumberToDateString(month))
      this.startDay.set(NumberToDateString(day))
    } else {
      this.startYear.set(undefined)
      this.startMonth.set(undefined)
      this.startDay.set(undefined)
    }
  }

  setSelectedEndDateToInputs(selectedDate: Date | undefined){
    if(isValidDate(selectedDate)) {
      let year = selectedDate.getFullYear()
      let month = selectedDate.getMonth() + 1;
      let day = selectedDate.getDate()

      this.endYear.set(NumberToDateString(year))
      this.endMonth.set(NumberToDateString(month))
      this.endDay.set(NumberToDateString(day))
    } else {
      this.endYear.set(undefined)
      this.endMonth.set(undefined)
      this.endDay.set(undefined)
    }
  }
}
