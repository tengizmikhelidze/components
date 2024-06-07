import {Component, model, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-calendar-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-input.component.html',
  styleUrl: './calendar-input.component.scss',
})
export class CalendarInputComponent {

  startDay = model<string | undefined>(undefined)
  startMonth = model<string | undefined>(undefined)
  startYear = model<string | undefined>(undefined)

  constructor() {

  }

  focusStartDay(startDayInput: HTMLInputElement) {
    startDayInput.focus()
  }

  focusOut(valueSignal: WritableSignal<string | undefined>, type: 'day' | 'month' | 'year', inputElement?: HTMLInputElement) {
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

    if(inputElement) {
      inputElement.focus()
    }
  }

  startDayChange(valueSignal: WritableSignal<string | undefined>,inputElement?: HTMLInputElement) {
    let value = valueSignal();

    if(value?.length === 2) {
      if(inputElement) {
        inputElement.focus()
      }
    }
  }
}
