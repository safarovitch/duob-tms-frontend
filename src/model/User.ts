export interface User {
    avatar: string | null;
    jwt: string | null;
    name: string;
    roles: string[];
    userId: number;
}
