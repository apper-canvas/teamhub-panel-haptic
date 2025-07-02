import mockAttendance from '@/services/mockData/attendance.json'

class AttendanceService {
  constructor() {
    this.attendance = [...mockAttendance]
  }

  async getAll() {
    await this.delay(300)
    return [...this.attendance]
  }

  async getById(id) {
    await this.delay(200)
    const record = this.attendance.find(att => att.Id === parseInt(id))
    if (!record) {
      throw new Error('Attendance record not found')
    }
    return { ...record }
  }

  async create(attendanceData) {
    await this.delay(400)
    const newId = Math.max(...this.attendance.map(att => att.Id), 0) + 1
    const newRecord = {
      ...attendanceData,
      Id: newId
    }
    this.attendance.push(newRecord)
    return { ...newRecord }
  }

  async update(id, attendanceData) {
    await this.delay(400)
    const index = this.attendance.findIndex(att => att.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Attendance record not found')
    }
    this.attendance[index] = { ...attendanceData, Id: parseInt(id) }
    return { ...this.attendance[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.attendance.findIndex(att => att.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Attendance record not found')
    }
    this.attendance.splice(index, 1)
    return true
  }
async getByDateRange(startDate, endDate) {
    await this.delay(300)
    const filtered = this.attendance.filter(att => {
      const recordDate = new Date(att.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      return recordDate >= start && recordDate <= end
    })
    return [...filtered]
  }

  async generateReport(startDate, endDate) {
    await this.delay(500)
    
    // Get attendance data for the date range
    const attendanceData = await this.getByDateRange(startDate, endDate)
    
    // Import employee service to get employee details
    const { employeeService } = await import('./employeeService.js')
    const employees = await employeeService.getAll()
    
    // Create employee lookup map
    const employeeMap = employees.reduce((map, emp) => {
      map[emp.Id] = emp
      return map
    }, {})
    
    // Generate CSV content
    const csvHeaders = [
      'Employee ID',
      'Employee Name',
      'Department',
      'Date',
      'Check In',
      'Check Out',
      'Status',
      'Hours Worked'
    ].join(',')
    
    const csvRows = attendanceData.map(record => {
      const employee = employeeMap[record.employeeId] || {}
      const hoursWorked = this.calculateHoursWorked(record.checkIn, record.checkOut)
      
      return [
        record.employeeId,
        `"${employee.firstName || ''} ${employee.lastName || ''}"`,
        `"${employee.department || ''}"`,
        record.date,
        record.checkIn || '',
        record.checkOut || '',
        record.status,
        hoursWorked
      ].join(',')
    })
    
    // Add summary statistics
    const summaryRows = this.generateSummaryStats(attendanceData, startDate, endDate)
    
    return [
      csvHeaders,
      ...csvRows,
      '',
      '--- SUMMARY STATISTICS ---',
      ...summaryRows
    ].join('\n')
  }

  calculateHoursWorked(checkIn, checkOut) {
    if (!checkIn || !checkOut) return '0.00'
    
    const [inHour, inMin] = checkIn.split(':').map(Number)
    const [outHour, outMin] = checkOut.split(':').map(Number)
    
    const inMinutes = inHour * 60 + inMin
    const outMinutes = outHour * 60 + outMin
    
    const diffMinutes = outMinutes - inMinutes
    const hours = diffMinutes / 60
    
    return hours > 0 ? hours.toFixed(2) : '0.00'
  }

  generateSummaryStats(attendanceData, startDate, endDate) {
    const stats = {
      total: attendanceData.length,
      present: attendanceData.filter(a => a.status === 'Present').length,
      absent: attendanceData.filter(a => a.status === 'Absent').length,
      late: attendanceData.filter(a => a.status === 'Late').length
    }
    
    const attendanceRate = stats.total > 0 ? ((stats.present + stats.late) / stats.total * 100).toFixed(1) : '0.0'
    
    return [
      `Report Period,${startDate} to ${endDate}`,
      `Total Records,${stats.total}`,
      `Present,${stats.present}`,
      `Absent,${stats.absent}`,
      `Late,${stats.late}`,
      `Attendance Rate,${attendanceRate}%`,
      `Generated On,${new Date().toISOString().split('T')[0]}`
    ]
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const attendanceService = new AttendanceService()