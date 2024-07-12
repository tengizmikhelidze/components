import {Component, forwardRef, model} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {
  BooleanValueAccessorDirective
} from "../../../../../shared/inputs/control-value-accessors/directives/boolean/boolean-value-accessor.directive";
import {ToggleInputOptions} from "./interfaces/toggle-input-options.interface";

@Component({
  selector: 'app-input-toggle',
  standalone: true,
  templateUrl: './input-toggle.component.html',
  styleUrl: './input-toggle.component.scss',
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
}
