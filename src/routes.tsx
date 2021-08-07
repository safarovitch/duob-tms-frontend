import {Redirect, Switch, Route} from "react-router-dom";
import {Fragment, Suspense, lazy} from "react";
import LoadingScreen from "./components/LoadingScreen";
import AuthGuard from "./components/AuthGuard";
import DashboardLayout from "./layouts/DashboardLayout";

const routesConfig = [
    {
        exact: true,
        path: '/',
        component: () => <Redirect to="/home" />
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
