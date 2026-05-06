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
                path: 'contracts',
                loadComponent: () =>
                    import('./pages/contracts/contracts.component').then(
                        (m) => m.ContractsComponent
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
