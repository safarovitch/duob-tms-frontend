import {useSelector} from "react-redux";
import {User} from "../model/User";

export default function usePermission(permissions: string[]) {
    const roles = useSelector(({user}: {user: User}) => user === null ? null : user.roles)

    if (roles === null) return true

    return roles.findIndex(r => permissions.indexOf(r) > -1) > -1;
}
