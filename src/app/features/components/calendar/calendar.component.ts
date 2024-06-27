import {Component, ElementRef, inject, model, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarInputComponent} from "./calendar-input/calendar-input.component";
import {Overlay, OverlayConfig, OverlayRef, PositionStrategy} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {CalendarUiComponent} from "./calendar-ui/calendar-ui.component";
import {Observable, Subject, takeUntil, tap} from "rxjs";

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, CalendarInputComponent],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
    private overlay = inject(Overlay);
    selectedStartDate = model<Date | undefined>(undefined)
    overlayRef = signal<OverlayRef | undefined>(undefined)
    $destroyOverLayRef: Subject<void> = new Subject()

    inputClicked(attachToThis: ElementRef | undefined) {
        if (attachToThis && !this.overlayRef()) {
            const overlayRef = this.createOverlay(attachToThis)

            this.overlayRef.set(this.createOverlay(attachToThis));
            const portal = overlayRef.attach(this.createPortal());

            console.log(this.selectedStartDate())
            portal.instance.selectedDate = this.selectedStartDate
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
