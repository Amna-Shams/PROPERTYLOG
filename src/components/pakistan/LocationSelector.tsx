import React, { useState } from 'react';

const locationData: Record<string, string[]> = {
  Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan'],
  Sindh: ['Karachi'],
  'Khyber Pakhtunkhwa': ['Peshawar'],
  Balochistan: ['Quetta'],
  'Islamabad Capital Territory': ['Islamabad'],
};

export const LocationSelector: React.FC<{onCitySelect: (city: string) => void}> = ({onCitySelect}) => {
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <select value={province} onChange={(e) => {setProvince(e.target.value); setCity('');}} className="p-2 border rounded">
        <option value="">Select Province</option>
        {Object.keys(locationData).map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      
      <select value={city} onChange={(e) => {setCity(e.target.value); onCitySelect(e.target.value);}} disabled={!province} className="p-2 border rounded">
        <option value="">Select City</option>
        {province && locationData[province].map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
};
