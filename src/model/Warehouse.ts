export interface Warehouse {
    id?: number
    name: string
}

export interface WarehouseListProps {
    className?: string;
}

export interface WarehouseListHeaderProps {
    className?: string;
}

export interface WarehouseFormProps {
    className?: string;
    warehouse?: Warehouse;
}
