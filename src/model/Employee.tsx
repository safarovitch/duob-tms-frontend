export type Employee = {
    id?: number,
    name: string,
    roles?: [],
    rolesId: number[],
    username: string,
    password: string,
    code: string,
    birthdate: string,
    address: string,
    phoneNumber: string,
    avatar?: string
}

export interface Role {
    id: number,
    name: string
}
