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
    DETAIL: [
      ADMIN,
      MANAGER,
      CASHIER
    ],
    CARGOS: {
        LIST: [
            ADMIN,
            MANAGER
        ]
    },
    RECONCILIATION_ACT: {
        LIST: [
            ADMIN,
            MANAGER
        ]
    },
    CREDIT: {
        LIST: [
            ADMIN,
            MANAGER,
            CASHIER
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
            MANAGER
        ]
    },
}

export default CUSTOMER
