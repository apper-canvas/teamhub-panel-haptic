import mockEmployees from '@/services/mockData/employees.json'

class EmployeeService {
  constructor() {
    this.employees = [...mockEmployees]
  }

  async getAll() {
    await this.delay(300)
    return [...this.employees]
  }

  async getById(id) {
    await this.delay(200)
    const employee = this.employees.find(emp => emp.Id === parseInt(id))
    if (!employee) {
      throw new Error('Employee not found')
    }
    return { ...employee }
  }

  async create(employeeData) {
    await this.delay(400)
    const newId = Math.max(...this.employees.map(emp => emp.Id), 0) + 1
    const newEmployee = {
      ...employeeData,
      Id: newId
    }
    this.employees.push(newEmployee)
    return { ...newEmployee }
  }

  async update(id, employeeData) {
    await this.delay(400)
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Employee not found')
    }
    this.employees[index] = { ...employeeData, Id: parseInt(id) }
    return { ...this.employees[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Employee not found')
    }
    this.employees.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const employeeService = new EmployeeService()