export interface User {
    userId: number;
    name: string;
    roles: string[];
    avatar: string;
    jwt: string | null;
}
