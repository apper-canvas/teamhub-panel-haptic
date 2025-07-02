class EmployeeService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'employee'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "role" } },
          { field: { Name: "department" } },
          { field: { Name: "start_date" } },
          { field: { Name: "status" } },
          { field: { Name: "photo" } },
          { field: { Name: "emergency_contact_name" } },
          { field: { Name: "emergency_contact_phone" } },
          { field: { Name: "emergency_contact_relationship" } }
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
        firstName: record.first_name,
        lastName: record.last_name,
        email: record.email,
        phone: record.phone,
        role: record.role,
        department: record.department,
        startDate: record.start_date,
        status: record.status,
        photo: record.photo,
        emergencyContact: {
          name: record.emergency_contact_name,
          phone: record.emergency_contact_phone,
          relationship: record.emergency_contact_relationship
        }
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees:", error?.response?.data?.message)
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
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "role" } },
          { field: { Name: "department" } },
          { field: { Name: "start_date" } },
          { field: { Name: "status" } },
          { field: { Name: "photo" } },
          { field: { Name: "emergency_contact_name" } },
          { field: { Name: "emergency_contact_phone" } },
          { field: { Name: "emergency_contact_relationship" } }
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
        firstName: record.first_name,
        lastName: record.last_name,
        email: record.email,
        phone: record.phone,
        role: record.role,
        department: record.department,
        startDate: record.start_date,
        status: record.status,
        photo: record.photo,
        emergencyContact: {
          name: record.emergency_contact_name,
          phone: record.emergency_contact_phone,
          relationship: record.emergency_contact_relationship
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching employee with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(employeeData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: `${employeeData.firstName} ${employeeData.lastName}`,
          Tags: employeeData.Tags || '',
          Owner: employeeData.Owner,
          first_name: employeeData.firstName,
          last_name: employeeData.lastName,
          email: employeeData.email,
          phone: employeeData.phone,
          role: employeeData.role,
          department: employeeData.department,
          start_date: employeeData.startDate,
          status: employeeData.status,
          photo: employeeData.photo || '',
          emergency_contact_name: employeeData.emergencyContact?.name || '',
          emergency_contact_phone: employeeData.emergencyContact?.phone || '',
          emergency_contact_relationship: employeeData.emergencyContact?.relationship || ''
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
          console.error(`Failed to create ${failedRecords.length} employee records:${JSON.stringify(failedRecords)}`)
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data
          return {
            Id: record.Id,
            firstName: record.first_name,
            lastName: record.last_name,
            email: record.email,
            phone: record.phone,
            role: record.role,
            department: record.department,
            startDate: record.start_date,
            status: record.status,
            photo: record.photo,
            emergencyContact: {
              name: record.emergency_contact_name,
              phone: record.emergency_contact_phone,
              relationship: record.emergency_contact_relationship
            }
          }
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating employee:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, employeeData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${employeeData.firstName} ${employeeData.lastName}`,
          Tags: employeeData.Tags,
          Owner: employeeData.Owner,
          first_name: employeeData.firstName,
          last_name: employeeData.lastName,
          email: employeeData.email,
          phone: employeeData.phone,
          role: employeeData.role,
          department: employeeData.department,
          start_date: employeeData.startDate,
          status: employeeData.status,
          photo: employeeData.photo,
          emergency_contact_name: employeeData.emergencyContact?.name,
          emergency_contact_phone: employeeData.emergencyContact?.phone,
          emergency_contact_relationship: employeeData.emergencyContact?.relationship
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
          console.error(`Failed to update ${failedUpdates.length} employee records:${JSON.stringify(failedUpdates)}`)
        }
        
        if (successfulUpdates.length > 0) {
          const record = successfulUpdates[0].data
          return {
            Id: record.Id,
            firstName: record.first_name,
            lastName: record.last_name,
            email: record.email,
            phone: record.phone,
            role: record.role,
            department: record.department,
            startDate: record.start_date,
            status: record.status,
            photo: record.photo,
            emergencyContact: {
              name: record.emergency_contact_name,
              phone: record.emergency_contact_phone,
              relationship: record.emergency_contact_relationship
            }
          }
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating employee:", error?.response?.data?.message)
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
          console.error(`Failed to delete ${failedDeletions.length} employee records:${JSON.stringify(failedDeletions)}`)
        }
        
        return successfulDeletions.length === 1
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting employee:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}

export const employeeService = new EmployeeService()