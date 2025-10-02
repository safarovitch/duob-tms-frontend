import {ADMIN, MANAGER, WAREHOUSEMAN} from "./roles";

const PROVIDER = {
    LIST: [
        ADMIN,
        WAREHOUSEMAN,
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
