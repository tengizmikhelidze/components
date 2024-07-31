import { Directive, Inject, Injector, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  NgModel,
  Validators
} from "@angular/forms";
import { distinctUntilChanged, startWith, Subject, takeUntil, tap } from "rxjs";

@Directive({
  selector: '[appControlValueAccessor]',
  standalone: true,
})
export class ControlValueAccessorDirective<T> implements ControlValueAccessor, OnInit {
  control!: FormControl<T | any>;
  isRequired = false;
  isReactiveForm = false;

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

  constructor(@Inject(Injector) private injector: Injector) {
  }

  ngOnInit() {
    this.setFormControl()
    this.isRequired = this.control?.hasValidator(Validators.required) ?? false;
  }


  setFormControl() {
    try {
      const control = this.injector.get(NgControl);

      if (control instanceof FormControlName) {
        this.control = this.injector
            .get(FormGroupDirective)
            .getControl(control as FormControlName);
        this.isReactiveForm = true;
      } else if (control instanceof FormControlDirective) {
        this.control = control.form as FormControl;
        this.isReactiveForm = true;
      } else if (control instanceof NgModel) {
        this.control = new FormControl(control.model);
        this.isReactiveForm = false;
      }

    } catch (err) {
      this.control = new FormControl();
    }
  }

  writeValue(value: T): void {
  }

  registerOnChange(fn: (val: T | any) => T): void {
    this.control?.valueChanges
        .pipe(
            takeUntil(this._destroy$),
            startWith(this.control.value),
            distinctUntilChanged(),
            tap((val) => fn(val))
        )
        .subscribe(() => (this.control as FormControl)?.markAsUntouched());

    this.onChange = fn;
  }

  registerOnTouched(fn: () => T): void {
    this.control?.markAllAsTouched()

    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
