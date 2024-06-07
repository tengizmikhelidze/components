import { Route } from '@angular/router';
import {ComponentsComponent} from "./components.component";

export const componentsRoutes: Route[] = [
    {
        path: '',
        component: ComponentsComponent,
        children: [
            {
                path: 'calendar',
                loadChildren: () => import('./calendar/calendar.routes').then(r=>r.calendarRoutes)
            }
        ]
    }
];
