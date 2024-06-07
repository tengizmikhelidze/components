import {Component, signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-calendar-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-input.component.html',
  styleUrl: './calendar-input.component.scss',
})
export class CalendarInputComponent {
  startDay = signal<string | undefined>(undefined)
  startMonth = signal<string | undefined>(undefined)
  startYear = signal<string | undefined>(undefined)
  focusStartDay(startDayInput: HTMLInputElement) {
    startDayInput.focus()
  }

  // preventText(event: KeyboardEvent) {
  //   const numRegex = /^[0-9]*$/gm
  //   const test = numRegex.test(event.key) || event.key === 'Backspace'
  //
  //   return test
  // }

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
  }
}
