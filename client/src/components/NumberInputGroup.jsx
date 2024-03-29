import React from 'react'

const NumberInputGroup = ({ label, value = '', onChange }) => {
  const handleInput = (event) => {
    const input = event.target.value
    if (parseInt(input)) {
      onChange(input)
    }
  }

  return (
    <div className="pb-4 border-gray-200" aria-hidden="true">
      <label
        htmlFor={label}
        className="block text-xs font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
        <input
          type="number"
          inputMode="numeric"
          name={label}
          id={label}
          min="0"
          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
          value={value}
          onInput={handleInput}
        />
      </div>
    </div>
  )
}

export default NumberInputGroup
