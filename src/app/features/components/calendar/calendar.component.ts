import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarInputComponent} from "./calendar-input/calendar-input.component";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarInputComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
    cha($event: string | undefined) {
        console.log($event)
    }
}
