import {Redirect, Switch, Route} from "react-router-dom";
import React, {Fragment, Suspense, lazy} from "react";
import LoadingScreen from "./components/LoadingScreen";
import AuthGuard from "./components/AuthGuard";
import DashboardLayout from "./layouts/DashboardLayout";

const routesConfig = [
    {
        exact: true,
        path: '/',
        component: () => <Redirect to="/app" />
    },
    {
        exact: true,
        guard: AuthGuard,
        path: '/login',
        component: lazy(() => import('./views/auth/Login'))
    },
    {
        path: '/app',
        guard: AuthGuard,
        layout: DashboardLayout,
        routes: [
            {
                exact: true,
                path: '/app',
                component: () => <Redirect to="/app/reports/dashboard" />
            },
            {
                exact: true,
                path: '/app/reports/dashboard',
                component: lazy(() => import('./views/reports/DashboardView'))
            },

            {
                exact: true,
                path: '/app/profile',
                component: lazy(() => import('./views/profile/UserProfile'))
            },
            {
                exact: true,
                path: '/app/customers',
                component: lazy(() => import('./views/customers/CustomerListView'))
            },
            {
                exact: true,
                path: '/app/customers/create',
                component: lazy(() => import('./views/customers/form'))
            },
            {
                exact: true,
                path: '/app/customers/:id/edit',
                component: lazy(() => import('./views/customers/form'))
            },
            {
                exact: true,
                path: '/app/customers/:id',
                component: lazy(() => import('./views/customers/profile/CustomerProfile'))
            },
            {
                exact: true,
                path: '/app/employees',
                component: lazy(() => import('./views/settings/UserListView'))
            },
            {
                exact: true,
                path: '/app/employees/create',
                component: lazy(() => import('./views/settings/UserCreateView'))
            },
            {
                exact: true,
                path: '/app/employees/:id/edit',
                component: lazy(() => import('./views/settings/UserEditView'))
            },
            {
                exact: true,
                path: '/app/providers',
                component: lazy(() => import('./views/providers/ProviderListView'))
            },
            {
                exact: true,
                path: '/app/providers/create',
                component: lazy(() => import('./views/providers/form'))
            },
            {
                exact: true,
                path: '/app/providers/:id/edit',
                component: lazy(() => import('./views/providers/form'))
            },
            {
                exact: true,
                path: '/app/warehouses',
                component: lazy(() => import('./views/warehouse/WarehouseListView'))
            },
            {
                exact: true,
                path: '/app/warehouses/create',
                component: lazy(() => import('./views/warehouse/form'))
            },
            {
                exact: true,
                path: '/app/warehouses/:id/edit',
                component: lazy(() => import('./views/warehouse/form'))
            },
        ]
    }
];

const renderRoutes = (routes: any) => (routes ? (
    <Suspense fallback={<LoadingScreen />}>
        <Switch>
            {routes.map((route: any, i: number) => {
                const Guard = route.guard || Fragment;
                const Layout = route.layout || Fragment;
                const Component = route.component;

                return (
                    <Route
                        key={i}
                        path={route.path}
                        exact={route.exact}
                        render={(props) => (
                            <Guard>
                                <Layout>
                                    {route.routes
                                        ? renderRoutes(route.routes)
                                        : <Component {...props} />}
                                </Layout>
                            </Guard>
                        )}
                    />
                );
            })}
        </Switch>
    </Suspense>
) : null);

function Routes() {
    return renderRoutes(routesConfig);
}

export default Routes;
