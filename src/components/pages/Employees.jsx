import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import FilterDropdown from "@/components/molecules/FilterDropdown"
import EmployeeCard from "@/components/molecules/EmployeeCard"
import EmployeeModal from "@/components/organisms/EmployeeModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { employeeService } from "@/services/api/employeeService"
import { departmentService } from "@/services/api/departmentService"

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterEmployees()
  }, [employees, searchTerm, departmentFilter, statusFilter])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [employeeData, departmentData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ])
      setEmployees(employeeData)
      setDepartments(departmentData)
    } catch (error) {
      setError('Failed to load employee data')
    } finally {
      setLoading(false)
    }
  }

  const filterEmployees = () => {
    let filtered = employees

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status === statusFilter)
    }

    setFilteredEmployees(filtered)
  }

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setModalOpen(true)
  }

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee)
    setModalOpen(true)
  }

  const handleEmployeeSaved = (savedEmployee) => {
    if (selectedEmployee) {
      setEmployees(prev => prev.map(emp => emp.Id === savedEmployee.Id ? savedEmployee : emp))
    } else {
      setEmployees(prev => [...prev, savedEmployee])
    }
  }

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.delete(employee.Id)
        setEmployees(prev => prev.filter(emp => emp.Id !== employee.Id))
        toast.success('Employee deleted successfully!')
      } catch (error) {
        toast.error('Error deleting employee. Please try again.')
      }
    }
  }

  const departmentOptions = departments.map(dept => ({
    value: dept.name,
    label: dept.name
  }))

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'On Leave', label: 'On Leave' }
  ]

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Directory</h2>
          <p className="text-gray-600">Manage your team members and their information</p>
        </div>
        <Button
          onClick={handleAddEmployee}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search employees by name, email, or role..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <FilterDropdown
              label="Department"
              options={departmentOptions}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              placeholder="All Departments"
            />
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="All Status"
            />
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      {filteredEmployees.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EmployeeCard
                employee={employee}
                onEdit={handleEditEmployee}
                onView={handleEditEmployee}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Empty
          title="No employees found"
          description={
            searchTerm || departmentFilter || statusFilter
              ? "No employees match your current filters. Try adjusting your search criteria."
              : "Get started by adding your first employee to the system."
          }
          actionLabel={!(searchTerm || departmentFilter || statusFilter) ? "Add First Employee" : undefined}
          onAction={!(searchTerm || departmentFilter || statusFilter) ? handleAddEmployee : undefined}
          icon="Users"
        />
      )}

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={selectedEmployee}
        onSave={handleEmployeeSaved}
      />
    </div>
  )
}

export default Employees