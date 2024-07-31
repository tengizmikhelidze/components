import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarComponent} from "../../../../shared/components/calendar/calendar.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-calendar-showcase',
  standalone: true,
    imports: [CommonModule, CalendarComponent, FormsModule],
  templateUrl: './calendar-showcase.component.html',
  styleUrl: './calendar-showcase.component.scss',
})
export class CalendarShowcaseComponent {
  value = [];

  c() {
    console.log(this.value)
  }
}
