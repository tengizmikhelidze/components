import {Component, model, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {NumberToMonth} from "../utility";
import {NumberToDateString} from "../utility/number-to-date-string.utility";

@Component({
    selector: 'app-calendar-ui',
    standalone: true,
    imports: [CommonModule, FaIconComponent],
    templateUrl: './calendar-ui.component.html',
    styleUrl: './calendar-ui.component.scss',
})
export class CalendarUiComponent {
    readonly numberToMonth = NumberToMonth;
    readonly numberToDateString = NumberToDateString;
    readonly chevronLeft = faChevronLeft
    readonly chevronRight = faChevronRight
    todayDate = signal<Date>(new Date())
    day = signal<string | undefined>(undefined)
    month = signal<string | undefined>(undefined)
    year = signal<string | undefined>(undefined)

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
}
