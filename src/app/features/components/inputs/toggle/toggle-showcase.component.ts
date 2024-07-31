import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputToggleComponent} from "../../../../../shared/components/inputs/toggle/input-toggle.component";
import {
  ToggleInputOptions
} from "../../../../../shared/components/inputs/toggle/interfaces/toggle-input-options.interface";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-toggle-showcase',
  standalone: true,
    imports: [CommonModule, InputToggleComponent, ReactiveFormsModule],
  templateUrl: './toggle-showcase.component.html',
  styleUrl: './toggle-showcase.component.scss',
})
export class ToggleShowcaseComponent {
  form = this.fb.group({
    toggle1: [false]
  })
  toggle1Options = signal<ToggleInputOptions>({
    id: 'toggle-1',
    required: true
  })

  constructor(private fb: FormBuilder) {
  }
}
