import {Component, input, model, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {NumberToMonth} from "../utility";
import {NumberToDateString} from "../utility/number-to-date-string.utility";
import {ChevronOptions, UiDate} from "../interfaces";
import {isValidDate} from "rxjs/internal/util/isDate";

@Component({
    selector: 'app-calendar-ui',
    standalone: true,
    imports: [CommonModule, FaIconComponent],
    templateUrl: './calendar-ui.component.html',
    styleUrl: './calendar-ui.component.scss',
})
export class CalendarUiComponent implements OnInit {
    readonly numberToMonth = NumberToMonth;
    readonly numberToDateString = NumberToDateString;
    readonly chevronLeft = faChevronLeft
    readonly chevronRight = faChevronRight
    todayDate = signal<Date>(new Date())
    mode = input<'single' | 'range'>('single')
    day = signal<string | undefined>(undefined)
    month = signal<string | undefined>(undefined)
    year = signal<string | undefined>(undefined)
    generatedUi = signal<UiDate[]>([])
    selectedStartDate = model<Date | undefined>()
    selectedEndDate = model<Date | undefined>()

    ngOnInit() {
        this.generateUi();
    }

    chevronHandler(signaler: WritableSignal<string | undefined>, chevronType: 'left' | 'right', options?: ChevronOptions) {
        signaler.update(value => {
            let tempData = (Number(value) || this.todayDate().getMonth()) + (chevronType === 'left' ? -1 : 1)
            if (options) {
                tempData = this.checkChevronOptions(tempData, options)
            }
            return this.numberToDateString(tempData)
        })
        this.generateUi()
    }

    checkChevronOptions(tempData: number, options: ChevronOptions): number {
        if (options.maxValue) {
            tempData = tempData > options.maxValue ? options.maxValue : tempData
        }
        if (options.minValue) {
            tempData = tempData < options.minValue ? options.minValue : tempData
        }

        return tempData
    }

    setToday() {
        let today = new Date();
        this.day.set(this.numberToDateString(new Date(today).getDate()))
        this.month.set(this.numberToDateString(new Date(today).getMonth()))
        this.year.set(this.numberToDateString(new Date(today).getFullYear()));
        this.setStartDate(new Date(today))
        this.generateUi()
    }

    generateUi() {
        const datesArr: UiDate[] = [];
        const month = Number(this.month()) || this.todayDate().getMonth();
        const year = Number(this.year()) || this.todayDate().getFullYear();

        let lastDateOfMonth = new Date(year, month + 1, 0).getDate()
        let lastDateOfPrevMonth = new Date(year, month, 0).getDate()
        let numbersBeforeFirstDate = new Date(year, month, 1).getDay() - 1;
        let numbersAfterLastDate = 7 - new Date(year, month + 1, 0).getDay();


        for (let i = 1; i <= lastDateOfMonth; i++) {
            let date: UiDate = {
                date: i,
                month: month,
                year: year,
                monthIndex: 'current'
            }
            datesArr.push(date)
        }

        for (let i = 0; i < numbersBeforeFirstDate; i++) {
            let date: UiDate = {
                date: lastDateOfPrevMonth - i,
                month: month,
                year: year,
                monthIndex: 'prev'
            }
            datesArr.unshift(date)
        }

        for (let i = 0; i < numbersAfterLastDate; i++) {
            let date: UiDate = {
                date: i + 1,
                month: month,
                year: year,
                monthIndex: 'next'
            }
            datesArr.push(date)
        }

        this.generatedUi.set(datesArr);
    }

    getUiClass(uiDate: UiDate) {
        return {
            [uiDate.monthIndex]: true,
            today: this.isTodayDate(uiDate),
            selected: this.isDateSelected(uiDate)
        }
    }

    isTodayDate(uiDate: UiDate): boolean {
        return uiDate.monthIndex === 'current'
            && Number(uiDate.year) === this.todayDate().getFullYear()
            && Number(uiDate.month) === this.todayDate().getMonth()
            && Number(uiDate.date) === this.todayDate().getDate()
    }

    selectDate(uiDate: UiDate) {
        let selectedDate = new Date(uiDate.year, uiDate.month, uiDate.date)
        switch (this.mode()) {
            case "range": this.selectRangeDate(selectedDate); break;

            default: {
                this.setStartDate(selectedDate)
            }
        }
    }

    selectRangeDate(selectedDate: Date) {
        if(
            (!this.selectedStartDate() || !this.isDateValid(this.selectedStartDate()))
            || selectedDate.getTime() < (this.selectedStartDate() as Date).getTime()
            || (!!this.selectedStartDate() && !!this.selectedEndDate())
        ) {
            this.setStartDate(selectedDate)
            return;
        }

        this.selectedEndDate.set(new Date(selectedDate))
    }

    setStartDate(date: Date) {
        this.selectedStartDate.set(new Date(date))
        this.selectedEndDate.set(undefined)
    }

    isDateSelected(uiDate: UiDate) {
        switch (this.mode()) {
            case "range":
                return this.isRangeDateSelected(uiDate);
            default:
                return this.isSingleDateSelected(uiDate)
        }
    }

    isSingleDateSelected(uiDate: UiDate): boolean {
        return uiDate.monthIndex === 'current'
            && this.selectedStartDate()?.getFullYear() === uiDate.year
            && this.selectedStartDate()?.getMonth() === uiDate.month
            && this.selectedStartDate()?.getDate() === uiDate.date
    }

    isRangeDateSelected(uiDate: UiDate): boolean {
        let selectedDate = new Date(uiDate.year, uiDate.month, uiDate.date)
        return uiDate.monthIndex === 'current'
            && !!this.selectedStartDate()
            && (this.selectedStartDate() as Date).getTime() <= selectedDate.getTime()
            && (this.selectedEndDate() || this.selectedStartDate() as Date).getTime() >= selectedDate.getTime()
    }

    isDateValid(date: Date | undefined) {
        return isValidDate(date)
    }

}
