import {Redirect, Switch, Route} from "react-router-dom";
import React, {Fragment, Suspense, lazy} from "react";
import LoadingScreen from "./components/LoadingScreen";
import AuthGuard from "./components/AuthGuard";
import DashboardLayout from "./layouts/DashboardLayout";
import PERMISSIONS from "./constants/permissions";
import usePermission from "./hooks/usePermission";
import EmployeeGuard from "./components/EmployeeGuard";
import CustomerGuard from "./components/CustomerGuard";
import CustomerLayout from "./layouts/CustomerLayout";
import GuestGuard from "./components/GuestGuard";
import RedirectGuard from "./components/RedirectGuard";

const routesConfig = [
    {
        exact: true,
        path: '/',
        guard: RedirectGuard,
        component: () => (<></>)
    },
    {
        exact: true,
        path: '/404',
        component: lazy(() => import('./views/Error404View'))
    },
    {
        exact: true,
        path: '/login',
        guard: GuestGuard,
        component: lazy(() => import('./views/auth/Login'))
    },
    {
        path: '/app',
        guard: AuthGuard,
        routes: [
            {
                path: '/app',
                guard: EmployeeGuard,
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
                        component: lazy(() => import('./views/profile'))
                    },
                    {
                        exact: true,
                        path: '/app/customers',
                        perm: PERMISSIONS.CUSTOMER.LIST,
                        component: lazy(() => import('./views/customers/CustomerListView'))
                    },
                    {
                        exact: true,
                        path: '/app/customers/create',
                        perm: PERMISSIONS.CUSTOMER.CREATE,
                        component: lazy(() => import('./views/customers/form'))
                    },
                    {
                        exact: true,
                        path: '/app/customers/:id/edit',
                        perm: PERMISSIONS.CUSTOMER.EDIT,
                        component: lazy(() => import('./views/customers/form'))
                    },
                    {
                        exact: true,
                        path: '/app/customers/:id/',
                        component: lazy(() => import('./views/customers/profile/RedirectToAdminCustomerDetail'))
                    },
                    {
                        exact: true,
                        path: '/app/customers/:id/:stuffId',
                        component: lazy(() => import('./views/customers/profile/AdminCustomerDetail'))
                    },
                    {
                        exact: true,
                        path: '/app/employees',
                        perm: PERMISSIONS.EMPLOYEE.LIST,
                        component: lazy(() => import('./views/employees/EmployeeListView'))
                    },
                    {
                        exact: true,
                        path: '/app/employees/create',
                        perm: PERMISSIONS.EMPLOYEE.CREATE,
                        component: lazy(() => import('./views/employees/EmployeeCreateView'))
                    },
                    {
                        exact: true,
                        path: '/app/employees/:id/edit',
                        perm: PERMISSIONS.EMPLOYEE.EDIT,
                        component: lazy(() => import('./views/employees/EmployeeEditView'))
                    },
                    {
                        exact: true,
                        path: '/app/providers',
                        perm: PERMISSIONS.PROVIDER.LIST,
                        component: lazy(() => import('./views/providers/ProviderListView'))
                    },
                    {
                        exact: true,
                        path: '/app/providers/create',
                        perm: PERMISSIONS.PROVIDER.CREATE,
                        component: lazy(() => import('./views/providers/form'))
                    },
                    {
                        exact: true,
                        path: '/app/providers/:id/edit',
                        perm: PERMISSIONS.PROVIDER.EDIT,
                        component: lazy(() => import('./views/providers/form'))
                    },
                    {
                        exact: true,
                        path: '/app/warehouses',
                        perm: PERMISSIONS.WAREHOUSE.LIST,
                        component: lazy(() => import('./views/warehouse/WarehouseListView'))
                    },
                    {
                        exact: true,
                        path: '/app/warehouses/create',
                        perm: PERMISSIONS.WAREHOUSE.CREATE,
                        component: lazy(() => import('./views/warehouse/form'))
                    },
                    {
                        exact: true,
                        path: '/app/warehouses/:id/edit',
                        perm: PERMISSIONS.WAREHOUSE.EDIT,
                        component: lazy(() => import('./views/warehouse/form'))
                    },
                    {
                        exact: true,
                        path: '/app/cargo',
                        perm: PERMISSIONS.CARGO.LIST,
                        component: () => <Redirect to="/app/cargo/product" />
                    },
                    {
                        exact: true,
                        path: '/app/cargo/:stuffId',
                        perm: PERMISSIONS.CARGO.LIST,
                        component: lazy(() => import('./views/cargo')),
                    },
                    {
                        exact: true,
                        path: '/app/cargo/product/create',
                        perm: PERMISSIONS.CARGO.LIST,
                        component: lazy(() => import('./views/cargo/product'))
                    },
                    {
                        exact: true,
                        path: '/app/cargo/product/edit',
                        perm: PERMISSIONS.CARGO.LIST,
                        component: lazy(() => import('./views/cargo/product'))
                    },
                    {
                        exact: true,
                        path: '/app/cargo/customs/create',
                        perm: PERMISSIONS.CARGO.LIST,
                        component: lazy(() => import('./views/cargo/customs'))
                    },
                    {
                        exact: true,
                        path: '/app/cargo/customs/edit',
                        perm: PERMISSIONS.CARGO.LIST,
                        component: lazy(() => import('./views/cargo/customs'))
                    },
                    {
                        exact: true,
                        path: '/app/cargo/type/create',
                        perm: PERMISSIONS.CARGO.LIST,
                        component: lazy(() => import('./views/cargo/type'))
                    },
                    {
                        exact: true,
                        path: '/app/cargo/type/edit',
                        perm: PERMISSIONS.CARGO.LIST,
                        component: lazy(() => import('./views/cargo/type'))
                    },
                    {
                        exact: true,
                        path: '/app/cargo/tariff/create',
                        perm: PERMISSIONS.CARGO.LIST,
                        component: lazy(() => import('./views/cargo/tariff'))
                    },
                    {
                        exact: true,
                        path: '/app/cargo/tariff/edit',
                        perm: PERMISSIONS.CARGO.LIST,
                        component: lazy(() => import('./views/cargo/tariff'))
                    },
                    {
                        exact: true,
                        path: '/app/roads',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/roads/RoadListView'))
                    },
                    {
                        exact: true,
                        path: '/app/road',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: () => <Redirect to="/app/road/driver" />
                    },
                    {
                        exact: true,
                        path: '/app/road/:stuffId',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/road')),
                    },
                    {
                        exact: true,
                        path: '/app/road/driver/create',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/road/driver'))
                    },
                    {
                        exact: true,
                        path: '/app/road/driver/edit',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/road/driver'))
                    },
                    {
                        exact: true,
                        path: '/app/road/truck/create',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/road/truck'))
                    },
                    {
                        exact: true,
                        path: '/app/road/truck/edit',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/road/truck'))
                    },
                    {
                        exact: true,
                        path: '/app/road/trailer/create',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/road/trailer'))
                    },
                    {
                        exact: true,
                        path: '/app/road/trailer/edit',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/road/trailer'))
                    },
                    {
                        exact: true,
                        path: '/app/fuels',
                        perm: PERMISSIONS.FUEL.LIST,
                        component: lazy(() => import('./views/fuel/FuelListView'))
                    },
                    {
                        exact: true,
                        path: '/app/fuels/income',
                        perm: PERMISSIONS.FUEL.LIST,
                        component: lazy(() => import('./views/fuel/IncomeForm'))
                    },
                    {
                        exact: true,
                        path: '/app/fuels/transfusion',
                        perm: PERMISSIONS.FUEL.LIST,
                        component: lazy(() => import('./views/fuel/TransfusionForm'))
                    },
                    {
                        exact: true,
                        path: '/app/fuels/outcome',
                        perm: PERMISSIONS.FUEL.LIST,
                        component: lazy(() => import('./views/fuel/OutcomeForm'))
                    },
                    {
                        component: () => <Redirect to="/404" />
                    }
                ]
            }
        ]
    },
    {
        path: '/customer',
        guard: AuthGuard,
        routes: [
            {
                path: '/customer',
                guard: CustomerGuard,
                layout: CustomerLayout,
                routes: [
                    {
                        exact: true,
                        path: '/customer',
                        component: () => <Redirect to="/customer/active-cargo" />
                    },
                    {
                        exact: true,
                        path: '/customer/profile',
                        component: lazy(() => import('./views/customers/profile/customer'))
                    },
                    {
                        exact: true,
                        path: '/customer/:stuffId',
                        component: lazy(() => import('./views/customers/profile/CustomerDetail'))
                    },
                    {
                        component: () => <Redirect to="/404" />
                    }
                ]
            }
        ]
    },
    {
        component: () => <Redirect to="/404" />
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

const filterRoutesConfig = (routes: any) => {
    return routes.filter((route: any) => {
        if (route.routes) {
            route.routes = filterRoutesConfig(route.routes)
            return true
        } else {
            if (route.perm) return usePermission(route.perm)
            else return true
        }
    })
}

const Routes: React.FC = () => {
    return renderRoutes(filterRoutesConfig(routesConfig));
}

export default Routes;
