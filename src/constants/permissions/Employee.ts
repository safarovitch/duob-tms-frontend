import {ADMIN, CASHIER, MANAGER} from "./roles";

const EMPLOYEE = {
    LIST: [
        ADMIN
    ],
    CREATE: [
        ADMIN
    ],
    EDIT: [
        ADMIN
    ],
    DELETE: [
        ADMIN
    ],
    ACCOUNTABILITY: {
        LIST: [
            ADMIN,
            MANAGER
        ],
        ADMIN_APPROVE: [
            ADMIN,
        ],
        APPROVE: [
            CASHIER,
        ],
        EDIT: [
            ADMIN,
            MANAGER
        ],
        DELETE: [
            ADMIN,
            MANAGER
        ]
    }
}

export default EMPLOYEE;
