import { Route } from '@angular/router';

export const featureRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'components'
            },
            {
                path: 'components',
                loadChildren: () => import('./components/components.routes').then(r => r.componentsRoutes)
            }
        ]
    }
];
