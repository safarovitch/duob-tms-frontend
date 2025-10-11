export interface User {
    avatar: string | null;
    jwt: string | null;
    name: string;
    balance?: number;
    roles: string[];
    userId: number;
    warehouseId?: number;
}
