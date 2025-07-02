import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { employeeService } from "@/services/api/employeeService"
import { departmentService } from "@/services/api/departmentService"

const EmployeeModal = ({ isOpen, onClose, employee, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    startDate: '',
    status: 'Active',
    photo: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  })
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      loadDepartments()
      if (employee) {
        setFormData({
          ...employee,
          emergencyContact: employee.emergencyContact || {
            name: '',
            phone: '',
            relationship: ''
          }
        })
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: '',
          department: '',
          startDate: '',
          status: 'Active',
          photo: '',
          emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
          }
        })
      }
      setErrors({})
    }
  }, [isOpen, employee])

  const loadDepartments = async () => {
    try {
      const data = await departmentService.getAll()
      setDepartments(data)
    } catch (error) {
      console.error('Error loading departments:', error)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.role.trim()) newErrors.role = 'Role is required'
    if (!formData.department.trim()) newErrors.department = 'Department is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      let savedEmployee
      if (employee) {
        savedEmployee = await employeeService.update(employee.Id, formData)
        toast.success('Employee updated successfully!')
      } else {
        savedEmployee = await employeeService.create(formData)
        toast.success('Employee added successfully!')
      }
      onSave?.(savedEmployee)
      onClose()
    } catch (error) {
      toast.error('Error saving employee. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (field.startsWith('emergencyContact.')) {
      const contactField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [contactField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {employee ? 'Edit Employee' : 'Add New Employee'}
                </h3>
                <Button onClick={onClose} variant="ghost" size="sm">
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={errors.lastName}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={errors.phone}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    error={errors.role}
                    required
                  />
                  <Select
                    label="Department"
                    options={departmentOptions}
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    error={errors.department}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    error={errors.startDate}
                    required
                  />
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Photo URL (Optional)"
                  value={formData.photo}
                  onChange={(e) => handleInputChange('photo', e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />

                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Contact Name"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    />
                    <Input
                      label="Contact Phone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <Input
                      label="Relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="secondary"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={16} className="mr-2" />
                        {employee ? 'Update Employee' : 'Add Employee'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EmployeeModal