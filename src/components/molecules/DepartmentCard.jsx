import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const DepartmentCard = ({ department, onEdit, onView }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
            <ApperIcon name="Building2" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {department.name}
            </h3>
            <p className="text-sm text-gray-600">
              {department.employeeCount} employees
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          {department.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="User" size={14} className="mr-2" />
          Manager: {department.managerId || 'Not assigned'}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => onView?.(department)}
            variant="secondary"
            size="sm"
          >
            <ApperIcon name="Eye" size={14} className="mr-1" />
            View
          </Button>
          <Button
            onClick={() => onEdit?.(department)}
            variant="ghost"
            size="sm"
          >
            <ApperIcon name="Edit2" size={14} className="mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default DepartmentCard