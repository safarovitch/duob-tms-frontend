
export interface CustomerListHeaderProps {
    className?: string;
}

export interface CustomerListProps {
    className?: string;
}

export interface CustomerFormProps {
    className?: string;
    customer?: Customer;
}

export interface Customer {
    id?: number;
    name: string;
    avatar?: string;
    phoneNumber: string;
    code: string;
    birthDate: Date | null | string;
    address: string;
    username: string;
    password?: string;
    placeNumber?: number;
    amount?: number;
    balance?: number;
}
