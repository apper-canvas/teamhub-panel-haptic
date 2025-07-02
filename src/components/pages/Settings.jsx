import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'TeamHub Pro',
    companyEmail: 'admin@teamhub.com',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    notifications: {
      email: true,
      desktop: true,
      attendance: true
    }
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setSettings(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Error saving settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const timezoneOptions = [
    { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
    { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
    { value: 'UTC-6', label: 'Central Time (UTC-6)' },
    { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
    { value: 'UTC+0', label: 'Greenwich Mean Time (UTC+0)' },
  ]

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your application preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-primary-100">
              <ApperIcon name="Building2" size={20} className="text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
          </div>

          <div className="space-y-4">
            <Input
              label="Company Name"
              value={settings.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
            />
            <Input
              label="Company Email"
              type="email"
              value={settings.companyEmail}
              onChange={(e) => handleInputChange('companyEmail', e.target.value)}
            />
            <Select
              label="Timezone"
              options={timezoneOptions}
              value={settings.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
            />
            <Select
              label="Date Format"
              options={dateFormatOptions}
              value={settings.dateFormat}
              onChange={(e) => handleInputChange('dateFormat', e.target.value)}
            />
          </div>
        </motion.div>

        {/* Working Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-green-100">
              <ApperIcon name="Clock" size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
          </div>

          <div className="space-y-4">
            <Input
              label="Start Time"
              type="time"
              value={settings.workingHours.start}
              onChange={(e) => handleInputChange('workingHours.start', e.target.value)}
            />
            <Input
              label="End Time"
              type="time"
              value={settings.workingHours.end}
              onChange={(e) => handleInputChange('workingHours.end', e.target.value)}
            />
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Info" size={16} className="text-blue-600" />
                <p className="text-sm text-blue-800">
                  Working hours are used for attendance tracking and late arrival calculations.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-100">
              <ApperIcon name="Bell" size={20} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.email}
                  onChange={(e) => handleInputChange('notifications.email', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Desktop Notifications</p>
                <p className="text-sm text-gray-600">Show desktop notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.desktop}
                  onChange={(e) => handleInputChange('notifications.desktop', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Attendance Alerts</p>
                <p className="text-sm text-gray-600">Get notified about attendance issues</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.attendance}
                  onChange={(e) => handleInputChange('notifications.attendance', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100">
              <ApperIcon name="Settings" size={20} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Storage Used</span>
              <span className="font-medium">2.4 GB / 10 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Backup</span>
              <span className="font-medium">2 hours ago</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => toast.info('Backup initiated')}
            >
              <ApperIcon name="Download" size={16} className="mr-2" />
              Create Backup
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-3"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default Settings