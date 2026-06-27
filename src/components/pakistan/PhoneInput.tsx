import React, { useState, ChangeEvent } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, error }) => {
  const [localNumber, setLocalNumber] = useState(value || '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (input.length > 10) input = input.slice(0, 10);
    
    // Must start with 3 (for mobile)
    // We allow clearing the field
    if (input.length > 0 && input[0] !== '3') {
       // Optionally show error here, or just don't update
       return;
    }

    // Formatting: 3XX-XXXXXXX
    let formatted = input;
    if (input.length > 3) {
      formatted = `${input.slice(0, 3)}-${input.slice(3)}`;
    }
    
    setLocalNumber(formatted);
    onChange(input);
  };

  const isValid = /3\d{9}/.test(value.replace(/\D/g, ''));
  const isAllSame = /(\d)\1{9}/.test(value.replace(/\D/g, ''));

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
        <span className="px-3 py-2 bg-slate-100 text-slate-500 font-mono">+92</span>
        <input
          type="text"
          value={localNumber}
          onChange={handleChange}
          placeholder="321-1234567"
          className="flex-1 px-3 py-2 outline-none font-mono"
          aria-label="Pakistan mobile number"
        />
        {isValid && !isAllSame && (
          <span className="px-3 text-green-500">✓</span>
        )}
      </div>
      {(error || (value.length === 10 && (!isValid || isAllSame))) && (
        <p className="text-red-500 text-xs mt-1">{error || 'Invalid mobile number'}</p>
      )}
    </div>
  );
};
