import {Component, ElementRef, inject, input, model, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarInputComponent} from "./calendar-input/calendar-input.component";
import {Overlay, OverlayConfig, OverlayRef, PositionStrategy} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {CalendarUiComponent} from "./calendar-ui/calendar-ui.component";
import {combineLatest, Observable, Subject, takeUntil, tap} from "rxjs";
import {NumberToDateString} from "./utility/number-to-date-string.utility";
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, CalendarInputComponent],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
    private overlay = inject(Overlay);
    mode = input<"single" | "range">("single")
    selectedStartDate = model<Date | undefined>(undefined)
    selectedEndDate = model<Date | undefined>(undefined)
    changeDate = output<[Date | undefined, Date | undefined]>()
    overlayRef = signal<OverlayRef | undefined>(undefined)
    $destroyOverLayRef: Subject<void> = new Subject()

    constructor() {
        this.listenSelectedDateChange().subscribe()
    }

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
                })
            )
    }

    positionStrategy(attachToThis: ElementRef): PositionStrategy {
        return this.overlay.position()
            .flexibleConnectedTo(attachToThis)
            .withFlexibleDimensions(false)
            .withDefaultOffsetY(2)
            .withPositions(
                [
                    {
                        originX: 'start',
                        originY: 'bottom',
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

    listenSelectedDateChange(): Observable<[Date | undefined, Date | undefined]> {
        return combineLatest([toObservable(this.selectedStartDate), toObservable(this.selectedEndDate)])
            .pipe(
                tap(([startDate, endDate])=>{
                    this.changeDate.emit([startDate, endDate])
                })
            )
    }
}
