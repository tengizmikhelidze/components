import {Route} from '@angular/router';
import {ComponentsComponent} from "./components.component";

export const componentsRoutes: Route[] = [
    {
        path: '',
        component: ComponentsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'calendar'
            },
            {
                path: 'calendar',
                loadChildren: () => import('./calendar/calendar.routes').then(r=>r.calendarRoutes)
            },
            {
                path: 'inputs',
                loadChildren: () => import('./inputs/inputs.routes').then(r=>r.InputsRoutes)
            }
        ]
    }
];
