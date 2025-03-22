import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../config/firebase';
import { Pin, MapPosition } from '../types/map';

interface PinFormProps {
  isVisible: boolean;
  position: MapPosition | null;
  onClose: () => void;
}

export default function PinForm({ isVisible, position, onClose }: PinFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Pin['category']>('landmark');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position || !title || !description) return;

    const userId = 'anonymous-user'; // Replace with actual auth
    const userName = `User${Math.floor(Math.random() * 1000)}`;

    const newPin: Omit<Pin, 'id'> = {
      title,
      description,
      category,
      lat: position.lat,
      lng: position.lng,
      userId,
      userName,
      timestamp: Date.now()
    };

    await push(ref(database, 'pins'), newPin);
    setTitle('');
    setDescription('');
    setCategory('landmark');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-96 bg-white p-6 rounded-lg shadow-lg z-50">
      <h3 className="text-xl font-bold mb-4">Add Your Discovery</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded h-24"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Pin['category'])}
          className="w-full p-2 border rounded"
        >
          <option value="landmark">Landmark</option>
          <option value="food">Food & Drinks</option>
          <option value="hidden">Hidden Gem</option>
          <option value="activity">Activity</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Discovery
          </button>
        </div>
      </form>
    </div>
  );
}