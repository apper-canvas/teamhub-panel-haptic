import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import EmployeeModal from "@/components/organisms/EmployeeModal";
import StatCard from "@/components/molecules/StatCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Attendance from "@/components/pages/Attendance";
import Employees from "@/components/pages/Employees";
import departmentsData from "@/services/mockData/departments.json";
import employeesData from "@/services/mockData/employees.json";
import attendanceData from "@/services/mockData/attendance.json";
import { attendanceService } from "@/services/api/attendanceService";
import { departmentService } from "@/services/api/departmentService";
import { employeeService } from "@/services/api/employeeService";
const Dashboard = () => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError('')
    try {
      const [employeeData, departmentData, attendanceData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll(),
        attendanceService.getAll()
      ])
      setEmployees(employeeData)
      setDepartments(departmentData)
      setAttendance(attendanceData)
    } catch (error) {
      setError('Failed to load dashboard data')
    } finally {
setLoading(false)
    }
  }
  const handleAddEmployee = () => {
    setIsEmployeeModalOpen(true)
  }

  const handleEmployeeSaved = (savedEmployee) => {
    setEmployees(prev => [...prev, savedEmployee])
  }

  if (loading) return <Loading type="dashboard" />
if (error) return <Error message={error} onRetry={loadDashboardData} />

  const activeEmployees = employees.filter(emp => emp.status === 'Active').length
  const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave').length
  const todayAttendance = attendance.filter(att => {
    const today = new Date().toISOString().split('T')[0]
    return att.date === today && att.status === 'Present'
  }).length

  // Get recent employees (last 5 added)
  const recentEmployees = employees.slice(-5).reverse()

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon="Users"
          color="blue"
          trend="up"
          trendValue="+5 this month"
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees}
          icon="UserCheck"
          color="green"
        />
        <StatCard
          title="Departments"
          value={departments.length}
          icon="Building2"
          color="purple"
        />
        <StatCard
          title="Present Today"
          value={todayAttendance}
          icon="Clock"
          color="amber"
          trend="up"
          trendValue="95% attendance"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Employees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Employees</h3>
            <ApperIcon name="Users" size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentEmployees.map((employee) => (
              <div key={employee.Id} className="flex items-center space-x-3">
                {employee.photo ? (
                  <img
                    src={employee.photo}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                    {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{employee.role}</p>
                </div>
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                  employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                  employee.status === 'On Leave' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {employee.status}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Department Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
            <ApperIcon name="Building2" size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {departments.map((department) => (
              <div key={department.Id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <ApperIcon name="Building2" size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{department.name}</p>
                    <p className="text-sm text-gray-600">{department.employeeCount} employees</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {((department.employeeCount / employees.length) * 100).toFixed(0)}%
                  </p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                      style={{ width: `${(department.employeeCount / employees.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={handleAddEmployee}
            className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary-100">
                <ApperIcon name="UserPlus" size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Employee</p>
                <p className="text-sm text-gray-600">Register new team member</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-100">
                <ApperIcon name="Clock" size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Mark Attendance</p>
                <p className="text-sm text-gray-600">Record daily attendance</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <ApperIcon name="Building2" size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Department</p>
                <p className="text-sm text-gray-600">Create new department</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <ApperIcon name="FileText" size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Generate Report</p>
                <p className="text-sm text-gray-600">Export employee data</p>
              </div>
            </div>
          </div>
</div>
      </motion.div>
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        employee={null}
        onSave={handleEmployeeSaved}
      />
    </div>
  )
}

export default Dashboard