import {ADMIN, CASHIER, MANAGER} from "./roles";

const APPLICATION = {
    LIST: [
        ADMIN,
        MANAGER,
        CASHIER,
    ],
    REFILL_BALANCE: {
        CREATE: [
            ADMIN,
            MANAGER,
        ],
        EDIT: [
            ADMIN,
            MANAGER,
        ],
        DELETE: [
            ADMIN,
            MANAGER,
        ],
        APPROVE: [
            ADMIN,
            CASHIER,
        ],
        ADD_PHOTO: [
            ADMIN,
            CASHIER,
        ]
    },
    INCOME_ARTICLE: {
        CREATE: [
            ADMIN,
            MANAGER,
        ],
        EDIT: [
            ADMIN,
            MANAGER,
        ],
        DELETE: [
            ADMIN,
            MANAGER,
        ],
        APPROVE: [
            ADMIN,
            CASHIER,
        ],
        ADD_PHOTO: [
            ADMIN,
            CASHIER,
        ]
    },
    OUTCOME_ARTICLE: {
        CREATE: [
            ADMIN,
            MANAGER,
        ],
        DELETE: [
            ADMIN,
            MANAGER,
        ],
        ADMIN_APPROVE: [
            ADMIN,
        ],
        APPROVE: [
            ADMIN,
            CASHIER,
        ],
        ADD_PHOTO: [
            ADMIN,
            CASHIER,
        ]
    },
    OUTCOME_TRANSFER_WAREHOUSE: {
        CREATE: [
            ADMIN,
            MANAGER,
        ],
        DELETE: [
            ADMIN,
            MANAGER,
        ],
        ADMIN_APPROVE: [
            ADMIN,
        ],
        APPROVE: [
            ADMIN,
            CASHIER,
        ],
        ADD_PHOTO: [
            ADMIN,
            CASHIER,
        ]
    }
}

export default APPLICATION
