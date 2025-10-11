import {ADMIN, MANAGER} from "./roles";

const CARGO = {
    LIST: [
        ADMIN
    ],
    EDIT: [
        ADMIN
    ],
    ISSUES: {
        LIST: [
            ADMIN,
            MANAGER
        ],
        DELETE: [
            ADMIN,
            MANAGER
        ],
        APPROVE: [
            ADMIN,
            MANAGER,
        ],
        CREDIT: [
            MANAGER
        ]
    }
}

export default CARGO
