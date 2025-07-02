import { useState } from "react"
import { useLocation } from "react-router-dom"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState("")

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard'
      case '/employees': return 'Employees'
      case '/departments': return 'Departments'
      case '/attendance': return 'Attendance'
      case '/settings': return 'Settings'
      default: return 'TeamHub Pro'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onMenuClick}
            variant="ghost"
            size="sm"
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block w-80">
            <SearchBar
              placeholder="Search employees, departments..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={20} />
          </Button>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" size={20} />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@teamhub.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header