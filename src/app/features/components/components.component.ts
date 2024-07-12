import {Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Navigation} from "./interfaces";
import {RouterLink, RouterOutlet} from "@angular/router";
import {faBarsProgress, faCalendar, faToggleOn} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FaIconComponent],
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss',
})
export class ComponentsComponent {
  readonly calendarIcon = faCalendar
  readonly progressIcon = faBarsProgress
  readonly toggleIcon = faToggleOn
  navigation = signal<Navigation[]>([
    {
      label: 'calendar',
      routerLink: 'calendar',
      icon: this.calendarIcon
    },
    {
      label: 'toggle',
      routerLink: 'inputs/toggle',
      icon: this.toggleIcon
    },
    {
      label: 'progress',
      routerLink: 'progress',
      icon: this.progressIcon
    }
  ])
}
