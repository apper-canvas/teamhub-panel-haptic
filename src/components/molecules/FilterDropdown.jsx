import { useState } from "react"
import Select from "@/components/atoms/Select"

const FilterDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "All" 
}) => {
  return (
    <div className="min-w-[120px]">
      <Select
        label={label}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default FilterDropdown