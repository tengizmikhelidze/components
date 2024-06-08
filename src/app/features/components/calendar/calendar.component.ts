import {Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarInputComponent} from "./calendar-input/calendar-input.component";
import {Overlay, OverlayConfig, OverlayRef, PositionStrategy} from "@angular/cdk/overlay";
import {ComponentPortal, Portal} from "@angular/cdk/portal";
import {CalendarUiComponent} from "./calendar-ui/calendar-ui.component";

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, CalendarInputComponent],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
    private overlay = inject(Overlay);
    startDay = signal('08')
    startMonth = signal('06')
    startYear = signal('2024')


    inputClicked(attachToThis: ElementRef | undefined) {
        if (attachToThis) {
            this.createOverlay(attachToThis)
        }
    }

    positionStrategy(attachToThis: ElementRef): PositionStrategy {
        return this.overlay.position()
            .flexibleConnectedTo(attachToThis)
            .setOrigin(attachToThis)
            .withPush(true)
            .withFlexibleDimensions(false)
            .withDefaultOffsetX(7)
            .withLockedPosition(false)
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
            height: '200px',
            width: '200px',
            panelClass: 'calendarOverlay',
            positionStrategy: this.positionStrategy(attachToThis),
            disposeOnNavigation: true,
            hasBackdrop: true,
        })
    }

    createOverlay(attachToThis: ElementRef): OverlayRef {
        return this.overlay.create(this.overlayConfig(attachToThis)).attach(this.createPortal())
    }

    createPortal(): Portal<CalendarUiComponent> {
        return new ComponentPortal(CalendarUiComponent)
    }
}
