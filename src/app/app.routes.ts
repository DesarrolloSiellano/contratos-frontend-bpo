import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'pages/dashboard', pathMatch: 'full' },
    {
        path: 'exception/:code',
        loadComponent: () =>
            import('./shared/components/exception/exception.component').then(
                (m) => m.ExceptionComponent
            ),
    },
    {
        path: 'pages',
        loadComponent: () =>
            import('./pages/template/template.component').then(
                (m) => m.TemplateComponent
            ),
        canActivate: [AuthGuard],

        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
            },
            {
                path: 'contractor',
                loadComponent: () =>
                    import('./pages/contractor/contractor.component').then(
                        (m) => m.ContractorComponent
                    ),
            },

            {
                path: 'contract',
                loadComponent: () =>
                    import('./pages/contract/contract.component').then(
                        (m) => m.ContractComponent
                    ),
            },
            {
                path: 'task',
                loadComponent: () =>
                    import('./pages/task/task.component').then(
                        (m) => m.TaskComponent
                    ),
            },
        ]
    }
];
