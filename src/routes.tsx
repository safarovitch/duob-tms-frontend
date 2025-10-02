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
                        // perm: PERMISSIONS.ANALYTICS.LIST,
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
                        path: '/app/customers/:id/:stuffId/show',
                        component: lazy(() => import('./views/customers/profile/detail/show'))
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
                        path: '/app/employee-accounts',
                        perm: PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.LIST,
                        component: lazy(() => import('./views/employees/accountability/EmployeeListView'))
                    },
                    {
                        exact: true,
                        path: '/app/employee-accounts/:employeeId',
                        perm: PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.LIST,
                        component: lazy(() => import('./views/employees/accountability/AccountabilityListView'))
                    },
                    {
                        exact: true,
                        path: '/app/employee-accounts/:employeeId/create',
                        perm: PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.LIST,
                        component: lazy(() => import('./views/employees/accountability/form'))
                    },
                    {
                        exact: true,
                        path: '/app/employee-accounts/:employeeId/edit',
                        perm: PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.LIST,
                        component: lazy(() => import('./views/employees/accountability/form'))
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
                        path: '/app/roads/create',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/roads/RoadCreateView'))
                    },
                    {
                        exact: true,
                        path: '/app/roads/:id',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/roads/RedirectToRoadMain'))
                    },
                    {
                        exact: true,
                        path: '/app/roads/:id/:stuffId',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/roads'))
                    },
                    {
                        exact: true,
                        path: '/app/roads/:id/:stuffId/create',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/roads/fuel-detail'))
                    },
                    {
                        exact: true,
                        path: '/app/roads/:id/:stuffId/edit',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/roads/fuel-detail'))
                    },
                    {
                        exact: true,
                        path: '/app/roads/:id/:stuffId/show',
                        component: lazy(() => import('./views/roads/cargo-show'))
                    },
                    {
                        exact: true,
                        path: '/app/road',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: () => <Redirect to="/app/road/truck" />
                    },
                    {
                        exact: true,
                        path: '/app/road/:stuffId',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/road')),
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
                        path: '/app/road/truck-type/create',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/road/truck-type'))
                    },
                    {
                        exact: true,
                        path: '/app/road/truck-type/edit',
                        perm: PERMISSIONS.ROAD.LIST,
                        component: lazy(() => import('./views/road/truck-type'))
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
                        exact: true,
                        path: '/app/article',
                        perm: PERMISSIONS.ARTICLE.LIST,
                        component: () => <Redirect to="/app/article/income" />
                    },
                    {
                        exact: true,
                        path: '/app/article/:stuffId',
                        perm: PERMISSIONS.ARTICLE.LIST,
                        component: lazy(() => import('./views/article')),
                    },
                    {
                        exact: true,
                        path: '/app/article/income/create',
                        perm: PERMISSIONS.ARTICLE.LIST,
                        component: lazy(() => import('./views/article/income'))
                    },
                    {
                        exact: true,
                        path: '/app/article/income/edit',
                        perm: PERMISSIONS.ARTICLE.LIST,
                        component: lazy(() => import('./views/article/income'))
                    },
                    {
                        exact: true,
                        path: '/app/article/outcome/create',
                        perm: PERMISSIONS.ARTICLE.LIST,
                        component: lazy(() => import('./views/article/outcome'))
                    },
                    {
                        exact: true,
                        path: '/app/article/outcome/edit',
                        perm: PERMISSIONS.ARTICLE.LIST,
                        component: lazy(() => import('./views/article/outcome'))
                    },
                    {
                        exact: true,
                        path: '/app/application',
                        perm: PERMISSIONS.APPLICATION.LIST,
                        component: () => <Redirect to="/app/application/refill-balance" />
                    },
                    {
                        exact: true,
                        path: '/app/application/:stuffId',
                        perm: PERMISSIONS.APPLICATION.LIST,
                        component: lazy(() => import('./views/application')),
                    },
                    {
                        exact: true,
                        path: '/app/application/refill-balance/create',
                        perm: PERMISSIONS.APPLICATION.REFILL_BALANCE.CREATE,
                        component: lazy(() => import('./views/application/refill-balance'))
                    },
                    {
                        exact: true,
                        path: '/app/application/refill-balance/edit',
                        perm: PERMISSIONS.APPLICATION.REFILL_BALANCE.EDIT,
                        component: lazy(() => import('./views/application/refill-balance'))
                    },
                    {
                        exact: true,
                        path: '/app/application/refill-balance/show',
                        perm: PERMISSIONS.APPLICATION.LIST,
                        component: lazy(() => import('./views/application/refill-balance/show'))
                    },
                    {
                        exact: true,
                        path: '/app/application/income-article/create',
                        perm: PERMISSIONS.APPLICATION.INCOME_ARTICLE.CREATE,
                        component: lazy(() => import('./views/application/income-article'))
                    },
                    {
                        exact: true,
                        path: '/app/application/income-article/edit',
                        perm: PERMISSIONS.APPLICATION.INCOME_ARTICLE.EDIT,
                        component: lazy(() => import('./views/application/income-article'))
                    },
                    {
                        exact: true,
                        path: '/app/application/income-article/show',
                        perm: PERMISSIONS.APPLICATION.LIST,
                        component: lazy(() => import('./views/application/income-article/show'))
                    },
                    {
                        exact: true,
                        path: '/app/application/outcome-article/create',
                        perm: PERMISSIONS.APPLICATION.OUTCOME_ARTICLE.CREATE,
                        component: lazy(() => import('./views/application/outcome-article'))
                    },
                    {
                        exact: true,
                        path: '/app/application/outcome-article/show',
                        perm: PERMISSIONS.APPLICATION.LIST,
                        component: lazy(() => import('./views/application/outcome-article/show'))
                    },
                    {
                        exact: true,
                        path: '/app/application/outcome-transfer-warehouse/create',
                        perm: PERMISSIONS.APPLICATION.OUTCOME_TRANSFER_WAREHOUSE.CREATE,
                        component: lazy(() => import('./views/application/outcome-transfer-warehouse'))
                    },
                    {
                        exact: true,
                        path: '/app/application/outcome-transfer-warehouse/show',
                        perm: PERMISSIONS.APPLICATION.LIST,
                        component: lazy(() => import('./views/application/outcome-transfer-warehouse/show'))
                    },
                    {
                        exact: true,
                        path: '/app/exchange',
                        perm: PERMISSIONS.EXCHANGE.LIST,
                        component: lazy(() => import('./views/exchange/index'))
                    },
                    {
                        exact: true,
                        path: '/app/exchange/edit',
                        perm: PERMISSIONS.EXCHANGE.LIST,
                        component: lazy(() => import('./views/exchange/ExchangeForm'))
                    },
                    {
                        exact: true,
                        path: '/app/exchange/create',
                        perm: PERMISSIONS.EXCHANGE.LIST,
                        component: lazy(() => import('./views/exchange/ExchangeForm'))
                    },
                    {
                        exact: true,
                        path: '/app/cargo-issues',
                        perm: PERMISSIONS.CARGO.ISSUES.LIST,
                        component: lazy(() => import('./views/cargo/issue'))
                    },
                    {
                        exact: true,
                        path: '/app/cargo-issues/:id/show',
                        perm: PERMISSIONS.CARGO.ISSUES.LIST,
                        component: lazy(() => import('./views/cargo/issue/show'))
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
                        exact: true,
                        path: '/customer/:stuffId/show',
                        component: lazy(() => import('./views/customers/profile/detail/show'))
                    },
                    {
                        component: () => <Redirect to="/404" />
                    }
                ]
            }
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
