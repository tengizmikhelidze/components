import {Route} from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        children: [
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'features'
            },
            {
                path: 'features',
                loadChildren: () => import('./features/features.routes').then(r => r.featureRoutes)
            }
        ]
    }
];
