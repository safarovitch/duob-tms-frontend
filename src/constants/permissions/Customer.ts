import {ADMIN, CASHIER, CLIENT, MANAGER, WAREHOUSEMAN} from "./roles";

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
    DETAIL: [
      ADMIN,
      MANAGER,
      CASHIER
    ],
    CARGOS: {
        LIST: [
            ADMIN,
            MANAGER,
            CLIENT,
        ]
    },
    RECONCILIATION_ACT: {
        LIST: [
            ADMIN,
            MANAGER,
            CLIENT,
        ]
    },
    CREDIT: {
        LIST: [
            ADMIN,
            MANAGER,
            CASHIER,
            CLIENT,
        ],
        ADMIN_APPROVE: [
            ADMIN,
        ],
        CASHIER_APPROVE: [
            CASHIER,
        ],
        PAID: [
            MANAGER,
        ],
        CREATE: [
            MANAGER,
            CASHIER
        ]
    },
    NOTIFICATION: {
        LIST: [
            ADMIN,
            MANAGER,
            CLIENT,
        ]
    },
}

export default CUSTOMER
