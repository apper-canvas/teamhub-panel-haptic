import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon = "Users",
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-full mb-6">
        <ApperIcon 
          name={icon} 
          size={64} 
          className="text-gray-400"
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
        {title || "No data found"}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
        {description || "Get started by adding your first item to see it appear here."}
      </p>
      
      {onAction && actionLabel && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty