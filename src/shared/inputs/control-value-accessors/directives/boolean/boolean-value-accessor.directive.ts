import {Directive} from '@angular/core';
import {ControlValueAccessorDirective} from "../base/control-value-accessor.directive";

@Directive({
  selector: '[appBooleanValueAccessor]',
  standalone: true,
})
export class BooleanValueAccessorDirective extends ControlValueAccessorDirective<boolean | undefined>{}
