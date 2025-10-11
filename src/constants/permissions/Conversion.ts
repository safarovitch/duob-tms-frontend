import {ADMIN, CASHIER} from "./roles";

const CONVERSION = {
    LIST: [
        ADMIN,
        CASHIER
    ],
    CREATE: [
        CASHIER
    ]
}

export default CONVERSION
