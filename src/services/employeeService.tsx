import axios from "../utils/axios";
import {Employee} from "../model/Employee";

class EmployeeService {
    getEmployees = (page: number, size: number, search: string, rolesId: string) => new Promise((resolve, reject) => {
        axios.get('/employees', {params: {page, size, search, rolesId}})
            .then(response => {
                if (response.data) resolve(response.data)
                else reject(response.data.error)
            }).catch(error => {
                reject(error)
            })
    })

    createEmployee = (values: Employee) => new Promise((resolve, reject) => {
        axios
            .post('/employees', values)
            .then(response => {
                if (response.data) resolve(response.data)
                else reject(response.data.error)
            }).catch(error => {
                reject(error)
            })
    })

    updateEmployee = (values: Employee) => new Promise((resolve, reject) => {
        axios
            .put('/employees', values)
            .then(response => {
                if (response.data) resolve(response.data)
                else reject(response.data.error)
            })
            .catch(error => {
                reject(error)
            })
    })

    deleteEmployee = (id: number) => new Promise((resolve, reject) => {
        axios
            .delete('/employees/' + id)
            .then(response => {
                if (response.status === 200) resolve(response.data)
                else reject(response.data.error)
            }).catch(error => {
                reject(error);
            })
    })

    getRoles = () => new Promise((resolve, reject) => {
        axios
            .get('/users/roles')
            .then(response => {
                if (response.data) resolve(response.data)
                else reject(response.data.error)
            }).catch(error => {
                reject(error)
        })
    })
}
let employeeService = new EmployeeService();

export default employeeService;
