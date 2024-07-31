import {Component, ElementRef, forwardRef, inject, input, model, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarInputComponent} from "./calendar-input/calendar-input.component";
import {Overlay, OverlayConfig, OverlayRef, PositionStrategy} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {CalendarUiComponent} from "./calendar-ui/calendar-ui.component";
import {Observable, Subject, takeUntil, tap} from "rxjs";
import {NumberToDateString} from "./utility/number-to-date-string.utility";
import {
    DateValueAccessorDirective
} from "../../inputs/control-value-accessors/directives/date/date-value-accessor.directive";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, CalendarInputComponent, FormsModule, ReactiveFormsModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CalendarComponent),
            multi: true,
        },
    ],
})
export class CalendarComponent extends DateValueAccessorDirective{
    private overlay = inject(Overlay);
    mode = input<"single" | "range">("single")
    selectedStartDate = model<Date | undefined>(undefined)
    selectedEndDate = model<Date | undefined>(undefined)
    selectedStartAfterPopupClosed = signal<Date | undefined>(undefined)
    selectedEndDateAfterPopupClosed = signal<Date | undefined>(undefined)
    changeDate = output<[Date | undefined, Date | undefined]>()
    overlayRef = signal<OverlayRef | undefined>(undefined)
    $destroyOverLayRef: Subject<void> = new Subject()


    inputClicked(attachToThis: ElementRef | undefined) {
        if (attachToThis && !this.overlayRef()) {
            const overlayRef = this.createOverlay(attachToThis)

            this.overlayRef.set(this.createOverlay(attachToThis));
            const portal = overlayRef.attach(this.createPortal());

            portal.instance.selectedStartDate = this.selectedStartDate
            portal.instance.day.set(NumberToDateString(this.selectedStartDate()?.getDate()))
            portal.instance.month.set(NumberToDateString(this.selectedStartDate()?.getMonth()))
            portal.instance.year.set(NumberToDateString(this.selectedStartDate()?.getFullYear()))

            if(this.mode() === 'range') {
                portal.instance.mode = this.mode
                portal.instance.selectedEndDate = this.selectedEndDate
            }
            this.listenBackdropChanges(overlayRef).subscribe()
        }
    }

    listenBackdropChanges(overlayRef: OverlayRef): Observable<any> {
        return overlayRef.backdropClick()
            .pipe(
                takeUntil(this.$destroyOverLayRef),
                tap(() => {
                    overlayRef.detach()
                    this.overlayRef.set(undefined);
                    this.$destroyOverLayRef.next()
                    this.changeDate.emit([this.selectedStartDate(), this.selectedEndDate()])
                    this.selectedStartAfterPopupClosed.set(this.selectedStartDate())
                    this.selectedEndDateAfterPopupClosed.set(this.selectedEndDate())
                    this.control.setValue([this.selectedStartDate(), this.selectedEndDate()])
                })
            )
    }

    positionStrategy(attachToThis: ElementRef): PositionStrategy {
        return this.overlay.position()
            .flexibleConnectedTo(attachToThis)
            .withFlexibleDimensions(false)
            .withPositions(
                [
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'top'
                    }
                ]
            )
    }

    overlayConfig(attachToThis: ElementRef): OverlayConfig {
        return new OverlayConfig({
            height: 'auto',
            width: 'auto',
            panelClass: 'calendarOverlay',
            positionStrategy: this.positionStrategy(attachToThis),
            disposeOnNavigation: true,
            hasBackdrop: true,
            backdropClass: 'calendarBackDrop'
        })
    }

    createOverlay(attachToThis: ElementRef): OverlayRef {
        return this.overlay.create(this.overlayConfig(attachToThis))
    }

    createPortal(): ComponentPortal<CalendarUiComponent> {
        return new ComponentPortal(CalendarUiComponent)
    }
}
