import {Component, computed, effect, Injector, model, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {NumberToMonth} from "../utility";
import {NumberToDateString} from "../utility/number-to-date-string.utility";
import {forkJoin} from "rxjs";
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-calendar-ui',
    standalone: true,
    imports: [CommonModule, FaIconComponent],
    templateUrl: './calendar-ui.component.html',
    styleUrl: './calendar-ui.component.scss',
})
export class CalendarUiComponent implements OnInit{
    readonly numberToMonth = NumberToMonth;
    readonly numberToDateString = NumberToDateString;
    readonly chevronLeft = faChevronLeft
    readonly chevronRight = faChevronRight
    todayDate = signal<Date>(new Date())
    day = signal<string | undefined>(undefined)
    month = signal<string | undefined>(undefined)
    year = signal<string | undefined>(undefined)
    generatedUi = signal<number[]>([])

    constructor(private injector: Injector) {}
    ngOnInit() {
        this.generateUi();
    }

    initializeSignals(): void {
        effect(() => {
            console.log(`The count is: ${this.day()}`);
        }, {injector: this.injector});
    }

    chevronHandler(signaler: WritableSignal<string | undefined>, chevronType: 'left' | 'right') {
        signaler.update(value => {
            let tempData = (Number(value) || this.todayDate().getMonth() + 1) + (chevronType === 'left' ? -1 : 1)
            return this.numberToDateString(tempData)
        })
    }

    setToday() {
        let today = new Date();
        this.day.set(this.numberToDateString(new Date(today).getDate()))
        this.month.set(this.numberToDateString(new Date(today).getMonth() + 1))
        this.year.set(this.numberToDateString(new Date(today).getFullYear()))
    }

    generateUi() {
        const datesArr: number[] = [];
        const day = Number(this.day()) || this.todayDate().getDate();
        const month = Number(this.month()) || this.todayDate().getMonth();
        const year = Number(this.year()) || this.todayDate().getFullYear();

        let lastDateOfMonth = new Date(year, month + 1, 0).getDate()
        let lastDateOfPrevMonth = new Date(year, month, 0).getDate()
        let numbersBeforeFirstDate = new Date(year, month, 1).getDay() - 1;
        let numbersAfterLastDate = 7 - new Date(year, month + 1, 0).getDay();

        for (let i = 1; i <= lastDateOfMonth; i++) {
            datesArr.push(i)
        }

        for(let i = 0; i < numbersBeforeFirstDate; i++) {
            datesArr.unshift(lastDateOfPrevMonth - i)
        }

        for(let i = 0; i < numbersAfterLastDate; i++) {
            datesArr.push(i + 1)
        }

        this.generatedUi.set(datesArr);
        console.log(datesArr)
    }
}
