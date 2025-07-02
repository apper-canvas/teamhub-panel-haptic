class DepartmentService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'department'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "description" } },
          { field: { Name: "employee_count" } },
          { field: { Name: "manager_id" } }
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
        name: record.Name,
        description: record.description,
        employeeCount: record.employee_count,
        managerId: record.manager_id
      }))
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching departments:", error?.response?.data?.message)
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
          { field: { Name: "description" } },
          { field: { Name: "employee_count" } },
          { field: { Name: "manager_id" } }
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
        name: record.Name,
        description: record.description,
        employeeCount: record.employee_count,
        managerId: record.manager_id
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching department with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(departmentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: departmentData.name,
          Tags: departmentData.Tags || '',
          Owner: departmentData.Owner,
          description: departmentData.description,
          employee_count: departmentData.employeeCount || 0,
          manager_id: departmentData.managerId
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
          console.error(`Failed to create ${failedRecords.length} department records:${JSON.stringify(failedRecords)}`)
        }
        
        if (successfulRecords.length > 0) {
          const record = successfulRecords[0].data
          return {
            Id: record.Id,
            name: record.Name,
            description: record.description,
            employeeCount: record.employee_count,
            managerId: record.manager_id
          }
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating department:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, departmentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: departmentData.name,
          Tags: departmentData.Tags,
          Owner: departmentData.Owner,
          description: departmentData.description,
          employee_count: departmentData.employeeCount,
          manager_id: departmentData.managerId
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
          console.error(`Failed to update ${failedUpdates.length} department records:${JSON.stringify(failedUpdates)}`)
        }
        
        if (successfulUpdates.length > 0) {
          const record = successfulUpdates[0].data
          return {
            Id: record.Id,
            name: record.Name,
            description: record.description,
            employeeCount: record.employee_count,
            managerId: record.manager_id
          }
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating department:", error?.response?.data?.message)
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
          console.error(`Failed to delete ${failedDeletions.length} department records:${JSON.stringify(failedDeletions)}`)
        }
        
        return successfulDeletions.length === 1
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting department:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}

export const departmentService = new DepartmentService()