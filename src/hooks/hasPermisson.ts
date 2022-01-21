import {User} from "../model/User";

export default function hasPermission(permissions: string[]) {
    const user = (JSON.parse(localStorage.getItem('user')!) as User)

    if (user === null) return true

    return user.roles.findIndex(r => permissions.indexOf(r) > -1) > -1;
}