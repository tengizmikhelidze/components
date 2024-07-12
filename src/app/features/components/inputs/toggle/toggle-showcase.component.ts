import {Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputToggleComponent} from "../../../../../shared/components/inputs/toggle/input-toggle.component";
import {
  ToggleInputOptions
} from "../../../../../shared/components/inputs/toggle/interfaces/toggle-input-options.interface";

@Component({
  selector: 'app-toggle-showcase',
  standalone: true,
    imports: [CommonModule, InputToggleComponent],
  templateUrl: './toggle-showcase.component.html',
  styleUrl: './toggle-showcase.component.scss',
})
export class ToggleShowcaseComponent {
  toggle1Options = signal<ToggleInputOptions>({
    id: 'toggle-1',
    required: true
  })
}
