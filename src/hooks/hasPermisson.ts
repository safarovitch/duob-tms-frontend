import {User} from "../model/User";

export default function hasPermission(permissions: string[]) {
    const localUser = localStorage.getItem('user')

    if (localUser === null) return false

    const user = JSON.parse(localUser) as User

    return user.roles?.findIndex(r => permissions.indexOf(r) > -1) > -1;
}