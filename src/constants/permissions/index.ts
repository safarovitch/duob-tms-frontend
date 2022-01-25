import EMPLOYEE from './Employee';
import WAREHOUSE from "./Warehouse";
import PROVIDER from "./Provider";
import CUSTOMER from "./Customer";
import CARGO from "./Cargo";
import ROAD from "./Road";
import FUEL from "./Fuel";
import ARTICLE from "./Article";
import APPLICATION from "./Application";
import EXCHANGE from "./Exchange";
import ANALYTICS from "./Analytics";
import WAREHOUSE_STATE from "./WarehouseState";
import STORAGE_COST from "./StorageCost";
import NOTIFICATION from "./Notification";
import CONVERSION from "./Conversion";
import {ADMIN, MANAGER} from "./roles";

const PERMISSIONS = {
    MANAGER: [MANAGER],
    ADMIN: [ADMIN],
    ANALYTICS,
    EMPLOYEE,
    WAREHOUSE,
    PROVIDER,
    CUSTOMER,
    CARGO,
    ROAD,
    FUEL,
    ARTICLE,
    APPLICATION,
    EXCHANGE,
    WAREHOUSE_STATE,
    STORAGE_COST,
    NOTIFICATION,
    CONVERSION,
}

export default PERMISSIONS;
