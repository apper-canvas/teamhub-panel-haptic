import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { attendanceService } from "@/services/api/attendanceService"
import { employeeService } from "@/services/api/employeeService"

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [employees, setEmployees] = useState([])
  const [filteredAttendance, setFilteredAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportDateRange, setReportDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd')
  })
  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterAttendanceByDate()
  }, [attendance, selectedDate])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [attendanceData, employeeData] = await Promise.all([
        attendanceService.getAll(),
        employeeService.getAll()
      ])
      setAttendance(attendanceData)
      setEmployees(employeeData)
    } catch (error) {
      setError('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  const filterAttendanceByDate = () => {
    const filtered = attendance.filter(att => att.date === selectedDate)
    setFilteredAttendance(filtered)
  }

  const getEmployeeById = (employeeId) => {
    return employees.find(emp => emp.Id === employeeId)
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'success'
      case 'absent': return 'danger'
      case 'late': return 'warning'
      default: return 'default'
    }
  }

const handleMarkAttendance = (employeeId, status) => {
    toast.success(`Marked ${status} for employee`)
    // In a real app, this would update the attendance record
  }

  const handleGenerateReport = async () => {
    if (!reportDateRange.startDate || !reportDateRange.endDate) {
      toast.error('Please select both start and end dates')
      return
    }

    if (new Date(reportDateRange.startDate) > new Date(reportDateRange.endDate)) {
      toast.error('Start date must be before end date')
      return
    }

    setReportLoading(true)
    try {
      const csvContent = await attendanceService.generateReport(
        reportDateRange.startDate,
        reportDateRange.endDate
      )
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `attendance-report-${reportDateRange.startDate}-to-${reportDateRange.endDate}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Attendance report downloaded successfully')
      setShowReportModal(false)
    } catch (error) {
      toast.error('Failed to generate report')
    } finally {
      setReportLoading(false)
    }
  }

  const todayStats = {
    present: filteredAttendance.filter(att => att.status === 'Present').length,
    absent: filteredAttendance.filter(att => att.status === 'Absent').length,
    late: filteredAttendance.filter(att => att.status === 'Late').length
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Tracking</h2>
          <p className="text-gray-600">Monitor daily attendance and track employee presence</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
<Button
            onClick={() => setShowReportModal(true)}
            variant="secondary"
          >
            <ApperIcon name="Download" size={16} className="mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-3xl font-bold text-green-600">{todayStats.present}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <ApperIcon name="CheckCircle" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-3xl font-bold text-red-600">{todayStats.absent}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600">
              <ApperIcon name="XCircle" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-3xl font-bold text-amber-600">{todayStats.late}</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
              <ApperIcon name="Clock" size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-blue-600">
                {employees.length > 0 ? Math.round((todayStats.present / employees.length) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <ApperIcon name="TrendingUp" size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance for {format(new Date(selectedDate), 'MMMM dd, yyyy')}
          </h3>
        </div>

        {employees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
{employees.map((employee, index) => {
                  const employeeAttendance = filteredAttendance.find(att => att.employeeId === employee.Id)
                  
                  return (
                    <motion.tr
                      key={employee.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {employee.photo ? (
                            <img
                              src={employee.photo}
                              alt={`${employee.firstName} ${employee.lastName}`}
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-semibold mr-3">
                              {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{employee.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employeeAttendance?.checkIn || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employeeAttendance?.checkOut || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(employeeAttendance?.status)}>
                          {employeeAttendance?.status || 'Not Marked'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleMarkAttendance(employee.Id, 'Present')}
                            size="sm"
                            variant="success"
                          >
                            Present
                          </Button>
                          <Button
                            onClick={() => handleMarkAttendance(employee.Id, 'Absent')}
                            size="sm"
                            variant="danger"
                          >
                            Absent
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="No employees found"
            description="Add employees to start tracking attendance."
            actionLabel="Add Employee"
            onAction={() => toast.info('Navigate to employees page')}
            icon="Users"
          />
        )}
</div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Generate Attendance Report</h3>
              <Button
                onClick={() => setShowReportModal(false)}
                variant="ghost"
                size="sm"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                label="Start Date"
                type="date"
                value={reportDateRange.startDate}
                onChange={(e) => setReportDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
              
              <Input
                label="End Date"
                type="date"
                value={reportDateRange.endDate}
                onChange={(e) => setReportDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Report will include:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Employee attendance records</li>
                      <li>Check-in and check-out times</li>
                      <li>Attendance status summary</li>
                      <li>Monthly statistics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowReportModal(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateReport}
                disabled={reportLoading}
                className="flex-1"
              >
                {reportLoading ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Download" size={16} className="mr-2" />
                    Download CSV
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Attendance