import { useContext } from 'react'
import { AuthContext } from '@/App'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const LogoutButton = ({ variant = "ghost", size = "sm", className = "" }) => {
  const { logout } = useContext(AuthContext)

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout()
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={`flex items-center space-x-2 ${className}`}
    >
      <ApperIcon name="LogOut" size={16} />
      <span>Logout</span>
    </Button>
  )
}

export default LogoutButton