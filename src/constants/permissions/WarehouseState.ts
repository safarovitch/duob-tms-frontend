import {ADMIN, ENGINEER, MANAGER} from "./roles";

const WAREHOUSE_STATE = {
    LIST: [
        ADMIN,
        ENGINEER,
        MANAGER
    ],
    SELECT_WAREHOUSE: [
        ADMIN
    ],
    CARGO_EDIT: [
        ADMIN
    ]
}
export default WAREHOUSE_STATE
