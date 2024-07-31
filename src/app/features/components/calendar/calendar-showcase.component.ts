import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from "../../../../shared/components/calendar/calendar.component";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-calendar-showcase',
  standalone: true,
    imports: [CommonModule, CalendarComponent, ReactiveFormsModule],
  templateUrl: './calendar-showcase.component.html',
  styleUrl: './calendar-showcase.component.scss',
})
export class CalendarShowcaseComponent {
  form = this.fb.group({
    calendar1: [new Date()],
    calendar2: [new Date()]
  })

  constructor(private fb: FormBuilder) {
  }
}
