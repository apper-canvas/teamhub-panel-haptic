class AttendanceService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'attendance'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "employee_id" } },
          { field: { Name: "date" } },
          { field: { Name: "check_in" } },
          { field: { Name: "check_out" } },
          { field: { Name: "status" } }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      if (!response.data || response.data.length === 0) {
        return []
      }
      
      // Map database fields to component expected format
      return response.data.map(record => ({
        Id: record.Id,
        employeeId: record.employee_id,
        date: record.date,
        checkIn: record.check_in,
        checkOut: record.check_out,
        status: record.status
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "employee_id" } },
          { field: { Name: "date" } },
          { field: { Name: "check_in" } },
          { field: { Name: "check_out" } },
          { field: { Name: "status" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response || !response.data) {
        return null
      }
      
      // Map database fields to component expected format
      const record = response.data
      return {
        Id: record.Id,
        employeeId: record.employee_id,
        date: record.date,
        checkIn: record.check_in,
        checkOut: record.check_out,
        status: record.status
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance record with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(attendanceData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: attendanceData.Name || `Attendance-${Date.now()}`,
          Tags: attendanceData.Tags || '',
          Owner: attendanceData.Owner,
          employee_id: parseInt(attendanceData.employeeId),
          date: attendanceData.date,
          check_in: attendanceData.checkIn,
          check_out: attendanceData.checkOut,
          status: attendanceData.status
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} attendance records:${JSON.stringify(failedRecords)}`)
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data
          return {
            Id: record.Id,
            employeeId: record.employee_id,
            date: record.date,
            checkIn: record.check_in,
            checkOut: record.check_out,
            status: record.status
          }
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance record:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, attendanceData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: attendanceData.Name,
          Tags: attendanceData.Tags,
          Owner: attendanceData.Owner,
          employee_id: parseInt(attendanceData.employeeId),
          date: attendanceData.date,
          check_in: attendanceData.checkIn,
          check_out: attendanceData.checkOut,
          status: attendanceData.status
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} attendance records:${JSON.stringify(failedUpdates)}`)
        }
        
        if (successfulUpdates.length > 0) {
          const record = successfulUpdates[0].data
          return {
            Id: record.Id,
            employeeId: record.employee_id,
            date: record.date,
            checkIn: record.check_in,
            checkOut: record.check_out,
            status: record.status
          }
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance record:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} attendance records:${JSON.stringify(failedDeletions)}`)
        }
        
        return successfulDeletions.length === 1
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance record:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "employee_id" } },
          { field: { Name: "date" } },
          { field: { Name: "check_in" } },
          { field: { Name: "check_out" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          },
          {
            FieldName: "date",
            Operator: "LessThanOrEqualTo",
            Values: [endDate]
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      if (!response.data || response.data.length === 0) {
        return []
      }
      
      return response.data.map(record => ({
        Id: record.Id,
        employeeId: record.employee_id,
        date: record.date,
        checkIn: record.check_in,
        checkOut: record.check_out,
        status: record.status
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date range:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async generateReport(startDate, endDate) {
    try {
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
          `"${employee.first_name || ''} ${employee.last_name || ''}"`,
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
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error generating attendance report:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
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
}

export const attendanceService = new AttendanceService()