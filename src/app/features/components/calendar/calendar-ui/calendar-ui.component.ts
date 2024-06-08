import {Component, model, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-calendar-ui',
    standalone: true,
    imports: [CommonModule, FaIconComponent],
    templateUrl: './calendar-ui.component.html',
    styleUrl: './calendar-ui.component.scss',
})
export class CalendarUiComponent {
    readonly chevronLeft = faChevronLeft
    readonly chevronRight = faChevronRight
    todayDate = signal<Date>(new Date())
    day = signal<string | undefined>(undefined)
    month = signal<string | undefined>(undefined)
    year = signal<string | undefined>(undefined)

    chevronMonth(chevronType: 'left' | 'right') {
        this.month.update(value => {
            let tempData = (Number(value) || this.todayDate().getMonth() + 1) + (chevronType === 'left' ? -1 : 1)
            return tempData.toString();
        })
    }

    chevronYear(chevronType: 'left' | 'right') {
        this.year.update(value => {
            let tempData = (Number(value) || this.todayDate().getFullYear()) + (chevronType === 'left' ? -1 : 1)
            return tempData.toString();
        })
    }
}
