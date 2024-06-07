import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarInputComponent} from "./calendar-input/calendar-input.component";
import {Overlay, OverlayConfig} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
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


    inputClicked(attachToThis: HTMLDivElement) {
        console.log(CalendarUiComponent)
        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(attachToThis)
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

        const overlayConfig: OverlayConfig = {
            height: '200px',
            width: '200px',
            panelClass: 'calendarOverlay',
            positionStrategy: positionStrategy,
            direction: "rtl"
        }
        const overlayRef = this.overlay.create(overlayConfig)
        const portal = new ComponentPortal(CalendarUiComponent)
        overlayRef.attach(portal)
    }
}
