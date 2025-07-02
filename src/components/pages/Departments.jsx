import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import DepartmentCard from "@/components/molecules/DepartmentCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { departmentService } from "@/services/api/departmentService"
import { employeeService } from "@/services/api/employeeService"

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterDepartments()
  }, [departments, searchTerm])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [departmentData, employeeData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ])
      
      // Calculate employee count for each department
      const departmentsWithCount = departmentData.map(dept => ({
        ...dept,
        employeeCount: employeeData.filter(emp => emp.department === dept.name).length
      }))
      
      setDepartments(departmentsWithCount)
      setEmployees(employeeData)
    } catch (error) {
      setError('Failed to load department data')
    } finally {
      setLoading(false)
    }
  }

  const filterDepartments = () => {
    let filtered = departments

    if (searchTerm) {
      filtered = filtered.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredDepartments(filtered)
  }

  const handleAddDepartment = () => {
    toast.info('Add department functionality would be implemented here')
  }

  const handleEditDepartment = (department) => {
    toast.info(`Edit department: ${department.name}`)
  }

  const handleViewDepartment = (department) => {
    toast.info(`View department details: ${department.name}`)
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
          <p className="text-gray-600">Organize your teams and manage departments</p>
        </div>
        <Button
          onClick={handleAddDepartment}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Department
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
        <SearchBar
          placeholder="Search departments by name or description..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Departments</p>
              <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <ApperIcon name="Building2" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <ApperIcon name="Users" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Team Size</p>
              <p className="text-3xl font-bold text-gray-900">
                {departments.length > 0 ? Math.round(employees.length / departments.length) : 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <ApperIcon name="UserCheck" size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Department Grid */}
      {filteredDepartments.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDepartments.map((department, index) => (
            <motion.div
              key={department.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DepartmentCard
                department={department}
                onEdit={handleEditDepartment}
                onView={handleViewDepartment}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Empty
          title="No departments found"
          description={
            searchTerm
              ? "No departments match your search criteria. Try adjusting your search terms."
              : "Get started by creating your first department to organize your teams."
          }
          actionLabel={!searchTerm ? "Add First Department" : undefined}
          onAction={!searchTerm ? handleAddDepartment : undefined}
          icon="Building2"
        />
      )}
    </div>
  )
}

export default Departments