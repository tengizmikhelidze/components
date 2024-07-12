import {Route} from '@angular/router';

export const InputsRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'toggle'
            },
            {
                path: 'toggle',
                loadChildren: () => import('./toggle/toggle.routes').then(r => r.ToggleRoutes)
            }
        ]
    }
];
