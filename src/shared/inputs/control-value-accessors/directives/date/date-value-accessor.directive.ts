import {Directive} from '@angular/core';
import {ControlValueAccessorDirective} from "../base/control-value-accessor.directive";

@Directive({
  selector: '[appDateValueAccessor]',
  standalone: true,
})
export class DateValueAccessorDirective extends ControlValueAccessorDirective<Date | undefined>{}
