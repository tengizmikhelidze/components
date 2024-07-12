import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarComponent} from "../../../../shared/components/calendar/calendar.component";

@Component({
  selector: 'app-calendar-showcase',
  standalone: true,
    imports: [CommonModule, CalendarComponent],
  templateUrl: './calendar-showcase.component.html',
  styleUrl: './calendar-showcase.component.scss',
})
export class CalendarShowcaseComponent {}
