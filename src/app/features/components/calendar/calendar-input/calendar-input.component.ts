import {Component, computed, ElementRef, model, output, ViewChild, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NumberToDateString} from "../utility/number-to-date-string.utility";

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
  selectedStartDate = model<Date | undefined>()

  inputMonthValue = computed<string>(()=> {
    if(this.startMonth()) {
      return NumberToDateString(Number(this.startMonth()) + 1)
    }

    return ''
  })
  @ViewChild('inputWrapperElement') inputWrapperElement: ElementRef | undefined;
  inputClicked = output<ElementRef | undefined>()


  inputClickedHandler(startDayInput: HTMLInputElement) {
    startDayInput.focus()
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

    this.selectDate();
  }

  onChange() {
    this.selectDate();
  }

  selectDate() {
    let year = Number(this.startYear())
    let month = Number(this.startMonth())
    let day = Number(this.startDay())
    let date = new Date(year, month - 1, day)

    this.selectedStartDate.set(new Date(date))
  }
}
