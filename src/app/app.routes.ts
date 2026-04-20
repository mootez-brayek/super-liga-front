import { Routes } from '@angular/router';
import { Login } from './core/auth/login/login';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [

    { 
        path: 'login', component: Login 
    },

    {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
        import('./features/admin/layout/layout').then(m => m.Layout),
    },

    {
        path: 'super-admin',
        canActivate: [roleGuard],
        data: { roles: ['SuperAdmin'] },
        loadComponent: () =>
            import('./features/super-admin/layout/layout').then(m => m.Layout),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/super-admin/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'admins',
                loadComponent: () =>
                import('./features/super-admin/admins/admins').then(m => m.Admins),
                 runGuardsAndResolvers: 'always',
            },
            {
                path: 'matches',
                loadComponent: () =>
                import('./features/super-admin/matches/matches').then(m => m.Matches)
            },
            {
                path: 'teams',
                loadComponent: () =>
                import('./features/super-admin/team/team').then(m => m.Team)
            },
            {
                path: 'standing',
                loadComponent: () =>
                import('./features/super-admin/standing/standing').then(m => m.StandingsComponent)
            }
        ]
    },

    {
        path: '',
        loadComponent: () =>
        import('./features/public/layout/layout').then(m => m.Layout),
    },

    {
        path: '**',
        redirectTo: ''
    }
];
