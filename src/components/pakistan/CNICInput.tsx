import React, { useState, ChangeEvent } from 'react';

export const CNICInput: React.FC = () => {
  const [value, setValue] = useState('');
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 13) input = input.slice(0, 13);
    
    let formatted = input;
    if (input.length > 5) formatted = `${input.slice(0, 5)}-${input.slice(5)}`;
    if (input.length > 12) formatted = `${formatted.slice(0, 13)}-${input.slice(12)}`;
    
    setValue(formatted);
  };

  const getProvince = (firstDigit: string) => {
    const map: Record<string, string> = {
      '1': 'Khyber Pakhtunkhwa', '2': 'FATA', '3': 'Punjab', '4': 'Sindh',
      '5': 'Balochistan', '6': 'Islamabad', '7': 'AJK', '8': 'Gilgit-Baltistan'
    };
    return map[firstDigit] || 'Unknown';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1" title="Format: XXXXX-XXXXXXX-X">
        CNIC Number <span className="text-slate-400 text-xs">(format: XXXXX-XXXXXXX-X)</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="XXXXX-XXXXXXX-X"
        className="w-full p-2 border rounded font-mono"
        aria-label="CNIC number"
      />
      {value.length > 0 && <p className="text-sm mt-1">Province: {getProvince(value[0])}</p>}
    </div>
  );
};
