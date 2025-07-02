import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Sidebar = ({ onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'BarChart3' },
    { name: 'Employees', href: '/employees', icon: 'Users' },
    { name: 'Departments', href: '/departments', icon: 'Building2' },
    { name: 'Attendance', href: '/attendance', icon: 'Clock' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <ApperIcon name="Users" size={18} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">TeamHub Pro</h2>
        </div>
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="lg:hidden"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon
                  name={item.icon}
                  size={18}
                  className={isActive ? 'text-primary-600' : 'text-gray-500'}
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <ApperIcon name="Check" size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">System Status</p>
            <p className="text-xs text-green-600">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar