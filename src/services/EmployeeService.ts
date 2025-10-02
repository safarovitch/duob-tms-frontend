import api from '../utils/Api'
import {API_BASE_URL} from "../config";
import {Accountability, Employee, Role} from "../model/Employee";
import {AccountabilityType} from "../constants";

class EmployeeService {
    getEmployees = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/employees/all`)
            .then(response => {resolve(response.data)})
            .catch(error => {reject(error)})
    })

    getFilteredEmployees = (page: number, size: number, search: string, rolesId: string) => new Promise((resolve, reject) => {
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

    getEmployeeById = (id: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/employees/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
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

    getFilteredEmployeeAccounts = (search: string) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/employee-accounts?search=${search}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredEmployeeAccount = (id: number, page: number, size: number, from: string, to: string, type: AccountabilityType | null) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/employee-accounts/${id}`, {params: {page, size, from, to, type}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    createEmployeeAccountability = (values: Accountability) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/employee-accounts`, values)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    updateEmployeeAccountability = (values: Accountability) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/employee-accounts`, values)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    approveEmployeeAccountabilityByCashier = (id: number) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/employee-accounts/cashier-confirmation/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    approveEmployeeAccountabilityByAdmin = (id: number) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/employee-accounts/admin-confirmation/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteEmployeeAccountability = (id: number) => new Promise((resolve, reject) => {
        api.delete(`${API_BASE_URL}/employee-accounts/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    uploadEmployeeAccountabilityImage = (id: number, file: File) => new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append("file", file);
        api.put(`${API_BASE_URL}/employee-accounts/${id}/file`, formData, {
                headers: {"Content-Type": "multipart/form-data",},
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteEmployeeAccountabilityImage = (id: number) => new Promise((resolve, reject) => {
        api.delete(`${API_BASE_URL}/employee-accounts/${id}/file`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}
let employeeService = new EmployeeService();

export default employeeService;
