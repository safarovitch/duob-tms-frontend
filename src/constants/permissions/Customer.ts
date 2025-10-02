import {ADMIN, MANAGER, WAREHOUSEMAN} from "./roles";

const CUSTOMER = {
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

export default CUSTOMER
