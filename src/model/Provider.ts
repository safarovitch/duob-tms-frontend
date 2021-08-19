export interface Provider {
    id?: number,
    name: string,
    code: string,
    address: string,
    phoneNumber: string,
    avatar?: string;
}

export interface ProviderListProps {
    className?: string;
}

export interface ProviderListHeaderProps {
    className?: string;
}

export interface ProviderFormProps {
    className?: string;
    provider?: Provider;
}
