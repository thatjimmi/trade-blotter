import React from "react";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => (
  <select
    multiple
    value={value}
    onChange={(e) =>
      onChange([...e.target.selectedOptions].map((opt) => opt.value))
    }
    className="w-full p-2 rounded-lg bg-[#0B0B0F] text-gray-300 border border-gray-800 
      focus:outline-none focus:ring-2 focus:ring-gray-700"
  >
    <option value="" disabled className="bg-[#0B0B0F]">
      {placeholder}
    </option>
    {options.map((opt) => (
      <option key={opt} value={opt} className="bg-[#0B0B0F] text-gray-300">
        {opt}
      </option>
    ))}
  </select>
);
