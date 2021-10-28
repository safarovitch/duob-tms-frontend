import {ADMIN, MANAGER} from "./roles";

const CARGO = {
    LIST: [
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
            MANAGER,
        ],
    }
}

export default CARGO
