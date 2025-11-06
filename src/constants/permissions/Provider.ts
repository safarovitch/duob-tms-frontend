import {ADMIN, MANAGER} from "./roles";

const PROVIDER = {
    LIST: [
        ADMIN,
        MANAGER
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
    ]
}

export default PROVIDER
