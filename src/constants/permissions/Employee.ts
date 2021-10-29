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
        ],
        ADD_DELETE_PHOTO: [
            CASHIER,
        ]
    }
}

export default EMPLOYEE;
