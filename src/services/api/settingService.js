class SettingService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'setting'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "company_name" } },
          { field: { Name: "company_email" } },
          { field: { Name: "timezone" } },
          { field: { Name: "date_format" } },
          { field: { Name: "working_hours_start" } },
          { field: { Name: "working_hours_end" } },
          { field: { Name: "notifications_email" } },
          { field: { Name: "notifications_desktop" } },
          { field: { Name: "notifications_attendance" } }
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
        companyName: record.company_name,
        companyEmail: record.company_email,
        timezone: record.timezone,
        dateFormat: record.date_format,
        workingHours: {
          start: record.working_hours_start,
          end: record.working_hours_end
        },
        notifications: {
          email: record.notifications_email === 'true',
          desktop: record.notifications_desktop === 'true',
          attendance: record.notifications_attendance === 'true'
        }
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching settings:", error?.response?.data?.message)
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
          { field: { Name: "company_name" } },
          { field: { Name: "company_email" } },
          { field: { Name: "timezone" } },
          { field: { Name: "date_format" } },
          { field: { Name: "working_hours_start" } },
          { field: { Name: "working_hours_end" } },
          { field: { Name: "notifications_email" } },
          { field: { Name: "notifications_desktop" } },
          { field: { Name: "notifications_attendance" } }
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
        companyName: record.company_name,
        companyEmail: record.company_email,
        timezone: record.timezone,
        dateFormat: record.date_format,
        workingHours: {
          start: record.working_hours_start,
          end: record.working_hours_end
        },
        notifications: {
          email: record.notifications_email === 'true',
          desktop: record.notifications_desktop === 'true',
          attendance: record.notifications_attendance === 'true'
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching setting with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(settingData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: settingData.Name || 'System Settings',
          Tags: settingData.Tags || '',
          Owner: settingData.Owner,
          company_name: settingData.companyName,
          company_email: settingData.companyEmail,
          timezone: settingData.timezone,
          date_format: settingData.dateFormat,
          working_hours_start: settingData.workingHours?.start,
          working_hours_end: settingData.workingHours?.end,
          notifications_email: settingData.notifications?.email ? 'true' : 'false',
          notifications_desktop: settingData.notifications?.desktop ? 'true' : 'false',
          notifications_attendance: settingData.notifications?.attendance ? 'true' : 'false'
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
          console.error(`Failed to create ${failedRecords.length} setting records:${JSON.stringify(failedRecords)}`)
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data
          return {
            Id: record.Id,
            companyName: record.company_name,
            companyEmail: record.company_email,
            timezone: record.timezone,
            dateFormat: record.date_format,
            workingHours: {
              start: record.working_hours_start,
              end: record.working_hours_end
            },
            notifications: {
              email: record.notifications_email === 'true',
              desktop: record.notifications_desktop === 'true',
              attendance: record.notifications_attendance === 'true'
            }
          }
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating setting:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, settingData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: settingData.Name || 'System Settings',
          Tags: settingData.Tags,
          Owner: settingData.Owner,
          company_name: settingData.companyName,
          company_email: settingData.companyEmail,
          timezone: settingData.timezone,
          date_format: settingData.dateFormat,
          working_hours_start: settingData.workingHours?.start,
          working_hours_end: settingData.workingHours?.end,
          notifications_email: settingData.notifications?.email ? 'true' : 'false',
          notifications_desktop: settingData.notifications?.desktop ? 'true' : 'false',
          notifications_attendance: settingData.notifications?.attendance ? 'true' : 'false'
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
          console.error(`Failed to update ${failedUpdates.length} setting records:${JSON.stringify(failedUpdates)}`)
        }
        
        if (successfulUpdates.length > 0) {
          const record = successfulUpdates[0].data
          return {
            Id: record.Id,
            companyName: record.company_name,
            companyEmail: record.company_email,
            timezone: record.timezone,
            dateFormat: record.date_format,
            workingHours: {
              start: record.working_hours_start,
              end: record.working_hours_end
            },
            notifications: {
              email: record.notifications_email === 'true',
              desktop: record.notifications_desktop === 'true',
              attendance: record.notifications_attendance === 'true'
            }
          }
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating setting:", error?.response?.data?.message)
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
          console.error(`Failed to delete ${failedDeletions.length} setting records:${JSON.stringify(failedDeletions)}`)
        }
        
        return successfulDeletions.length === 1
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting setting:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}

export const settingService = new SettingService()