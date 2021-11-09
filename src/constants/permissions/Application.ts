import {ADMIN, CASHIER, MANAGER} from "./roles";

const APPLICATION = {
    LIST: [
        ADMIN,
        MANAGER,
        CASHIER,
    ],
    REFILL_BALANCE: {
        CREATE: [
            MANAGER,
        ],
        EDIT: [
            MANAGER,
        ],
        DELETE: [
            MANAGER,
        ],
        APPROVE: [
            CASHIER,
        ],
        ADD_PHOTO: [
            ADMIN,
            CASHIER,
        ]
    },
    INCOME_ARTICLE: {
        CREATE: [
            MANAGER,
        ],
        EDIT: [
            MANAGER,
        ],
        DELETE: [
            MANAGER,
        ],
        APPROVE: [
            CASHIER,
        ],
        ADD_PHOTO: [
            ADMIN,
            CASHIER,
        ]
    },
    OUTCOME_ARTICLE: {
        CREATE: [
            MANAGER,
        ],
        DELETE: [
            MANAGER,
        ],
        ADMIN_APPROVE: [
            ADMIN,
        ],
        APPROVE: [
            CASHIER,
        ],
        ADD_PHOTO: [
            ADMIN,
            CASHIER,
        ]
    },
    OUTCOME_TRANSFER_WAREHOUSE: {
        CREATE: [
            MANAGER,
        ],
        DELETE: [
            MANAGER,
        ],
        ADMIN_APPROVE: [
            ADMIN,
        ],
        APPROVE: [
            CASHIER,
        ],
        ADD_PHOTO: [
            ADMIN,
            CASHIER,
        ]
    },
    ROAD_DRIVER: {
        CREATE: [
            MANAGER,
        ],
        DELETE: [
            MANAGER,
        ],
        APPROVE: [
            CASHIER,
        ],
    }
}

export default APPLICATION
