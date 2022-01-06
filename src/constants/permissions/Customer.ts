import {ADMIN, CASHIER, MANAGER, WAREHOUSEMAN} from "./roles";

const CUSTOMER = {
    LIST: [
        ADMIN,
        WAREHOUSEMAN,
        MANAGER,
        CASHIER
    ],
    CREATE: [
        ADMIN,
        MANAGER
    ],
    EDIT: [
        ADMIN
    ],
    DELETE: [
        ADMIN
    ],
    CREDIT: {
        ADMIN_APPROVE: [
            ADMIN,
        ],
        CASHIER_APPROVE: [
            CASHIER,
        ],
        PAID: [
            CASHIER,
        ]
    }
}

export default CUSTOMER
