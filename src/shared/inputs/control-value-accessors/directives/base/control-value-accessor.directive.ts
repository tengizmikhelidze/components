import {Directive, Inject, Injector, OnInit} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl, Validators
} from "@angular/forms";
import {distinctUntilChanged, startWith, Subject, takeUntil, tap} from "rxjs";

@Directive({
  selector: '[appControlValueAccessor]',
  standalone: true,
})
export class ControlValueAccessorDirective<T> implements ControlValueAccessor, OnInit {
  control!: FormControl<T | any> | NgControl;
  isRequired = false;

  private _isDisabled = false;
  private _destroy$ = new Subject<void>();
  private _onTouched!: () => T;

  private _value: T | any;
  public get myValue(): T | any { return this._value }
  public set myValue(v: T | any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }
  onChange = (v: T | any) => { };

  constructor(@Inject(Injector) private injector: Injector) {}

  ngOnInit() {
    this.setFormControl();
    if(this.control instanceof FormControl){
      this.isRequired = this.control?.hasValidator(Validators.required) ?? false;
    }
  }

  setFormControl() {
    try {
      const control = this.injector.get(NgControl);

      if(control instanceof FormControlName) {
        this.control = this.injector
            .get(FormGroupDirective)
            .getControl(control as FormControlName);
      } else if (!(this.control instanceof NgControl)) {
        this.control = (control as FormControlDirective)
            .form as FormControl;
      }

    } catch (err) {
      this.control = new FormControl();
    }
  }

  writeValue(value: T): void {
    if(this.control instanceof FormControl){
      this.control
          ? this.control.setValue(value)
          : (this.control = new FormControl<T>(value));
    }

    this.myValue = value;
  }

  registerOnChange(fn: (val: T | any) => T): void {
    if(this.control instanceof FormControl) {
      this.control?.valueChanges
          .pipe(
              takeUntil(this._destroy$),
              startWith(this.control.value),
              distinctUntilChanged(),
              tap((val) => fn(val)),
              tap((val) => fn(val))
          )
          .subscribe(() => (this.control as FormControl)?.markAsUntouched());
    }

    this.onChange = fn;
  }

  registerOnTouched(fn: () => T): void {
    if(this.control instanceof FormControl) {
      this.control?.markAllAsTouched()
    }

    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }
}
