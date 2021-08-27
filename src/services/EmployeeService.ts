import api from '../utils/Api'
import {API_BASE_URL} from "../config";
import {Employee, Role} from "../model/Employee";

class EmployeeService {
    getEmployees = (page: number, size: number, search: string, rolesId: string) => new Promise((resolve, reject) => {
        api
            .get(`${API_BASE_URL}/employees`, {params: {page, size, search, rolesId}})
            .then(response => {
                resolve(response.data)
            }).catch(error => {reject(error)})
    })

    getEmployee = () => new Promise((resolve, reject) => {
        api
            .get(`${API_BASE_URL}/employees/profile`)
            .then(response => {
                resolve(response.data)
            }).catch(error => {reject(error)})
    })

    updatePassword = (params: {oldPassword: string, newPassword: string}) => new Promise((resolve, reject) => {
        api
            .put(`${API_BASE_URL}/employees/change-password`, params)
            .then(response => {
                resolve(response.data)
            }).catch(error => {reject(error)})
    })

    uploadAvatar = (file: File) => new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append("file", file);
        api
            .put(`${API_BASE_URL}/employees/avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(response => {
                resolve(response)
            }).catch(error => {reject(error)})
    })

    deleteAvatar = (name: string) => new Promise((resolve, reject) => {
        api.delete(`${API_BASE_URL}/employees/avatar/${name}`)
            .then(response => {
                if (response.status === 200) resolve(response.data)
                else reject(response.data.error)
            }).catch(error => {reject(error)})
    })

    createEmployee = (values: Employee) => new Promise((resolve, reject) => {
        api
            .post(`${API_BASE_URL}/employees`, values)
            .then(response => {
                resolve(response.data)
            }).catch(error => {reject(error)})
    })

    updateEmployee = (values: Employee) => new Promise((resolve, reject) => {
        api
            .put(`${API_BASE_URL}/employees`, values)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {reject(error)})
    })

    deleteEmployee = (id: number) => new Promise((resolve, reject) => {
        api
            .delete(`${API_BASE_URL}/employees/${id}`)
            .then(response => {
                if (response.status === 200) resolve(response.data)
                else reject(response.data.error)
            }).catch(error => {reject(error)})
    })

    getRoles = () => new Promise((resolve, reject) => {
        api
            .get(`${API_BASE_URL}/users/roles`)
            .then(response => {
                resolve((response.data as Role[]).filter(v => v.name !== 'CLIENT'))
            }).catch(error => {reject(error)})
    })
}
let employeeService = new EmployeeService();

export default employeeService;
