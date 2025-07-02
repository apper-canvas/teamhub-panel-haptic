import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className = "",
  value = "",
  onChange
}) => {
  const [searchTerm, setSearchTerm] = useState(value)

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    if (onChange) {
      onChange(newValue)
    }
    if (onSearch) {
      onSearch(newValue)
    }
  }

  const handleClear = () => {
    setSearchTerm("")
    if (onChange) {
      onChange("")
    }
    if (onSearch) {
      onSearch("")
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={16} className="text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name="X" size={16} />
        </button>
      )}
    </div>
  )
}

export default SearchBar