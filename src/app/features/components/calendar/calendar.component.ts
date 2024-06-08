import {Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarInputComponent} from "./calendar-input/calendar-input.component";
import {Overlay, OverlayConfig, OverlayRef, PositionStrategy} from "@angular/cdk/overlay";
import {ComponentPortal, Portal} from "@angular/cdk/portal";
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
    startDay = signal(undefined)
    startMonth = signal(undefined)
    startYear = signal(undefined)
    overlayRef = signal<OverlayRef | undefined>(undefined)
    $destroyOverLayRef: Subject<void> = new Subject()


    inputClicked(attachToThis: ElementRef | undefined) {
        if (attachToThis && !this.overlayRef()) {
            const overlayRef = this.createOverlay(attachToThis)

            this.overlayRef.set(this.createOverlay(attachToThis));
            const portal = overlayRef.attach(this.createPortal());

            portal.instance.day = this.startDay
            portal.instance.month = this.startMonth
            portal.instance.year = this.startYear
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
            .withDefaultOffsetY(5)
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
}
