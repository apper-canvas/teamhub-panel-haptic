import { motion } from "framer-motion"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const EmployeeCard = ({ employee, onEdit, onView }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'active'
      case 'inactive': return 'inactive'
      case 'on leave': return 'leave'
      default: return 'default'
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {employee.photo ? (
            <img
              src={employee.photo}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
              {getInitials(employee.firstName, employee.lastName)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-600">{employee.role}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(employee.status)}>
          {employee.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Building2" size={14} className="mr-2" />
          {employee.department}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Mail" size={14} className="mr-2" />
          {employee.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Phone" size={14} className="mr-2" />
          {employee.phone}
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={() => onView?.(employee)}
          variant="secondary"
          size="sm"
          className="flex-1"
        >
          <ApperIcon name="Eye" size={14} className="mr-1" />
          View
        </Button>
        <Button
          onClick={() => onEdit?.(employee)}
          variant="ghost"
          size="sm"
          className="flex-1"
        >
          <ApperIcon name="Edit2" size={14} className="mr-1" />
          Edit
        </Button>
      </div>
    </motion.div>
  )
}

export default EmployeeCard