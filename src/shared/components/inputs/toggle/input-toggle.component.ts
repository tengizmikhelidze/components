import {Component, forwardRef, model} from '@angular/core';
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {ToggleInputOptions} from "./interfaces/toggle-input-options.interface";
import {CommonModule} from "@angular/common";
import {
  BooleanValueAccessorDirective
} from "../../../inputs/control-value-accessors/directives/boolean/boolean-value-accessor.directive";

@Component({
  selector: 'app-input-toggle',
  standalone: true,
  templateUrl: './input-toggle.component.html',
  styleUrl: './input-toggle.component.scss',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputToggleComponent),
      multi: true,
    },
  ],
})
export class InputToggleComponent extends BooleanValueAccessorDirective {
  inputOptions = model<ToggleInputOptions>({
    id: 'toggle-id',
    required: false
  })

  onThumbClick() {
    console.log()
  }
}
