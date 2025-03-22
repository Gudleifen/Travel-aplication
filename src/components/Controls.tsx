import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Pin } from '../types/map';

interface ControlsProps {
  onLocateMe: () => void;
  onAddPin: () => void;
  onFilterChange: (category: string) => void;
}

export default function Controls({ onLocateMe, onAddPin, onFilterChange }: ControlsProps) {
  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10 space-y-2">
      <button
        onClick={onLocateMe}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
      >
        <MapPin size={18} />
        My Location
      </button>
      <button
        onClick={onAddPin}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
      >
        <Plus size={18} />
        Add Discovery
      </button>
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="all">All Discoveries</option>
        <option value="landmark">Landmarks</option>
        <option value="food">Food & Drinks</option>
        <option value="hidden">Hidden Gems</option>
        <option value="activity">Activities</option>
      </select>
    </div>
  );
}