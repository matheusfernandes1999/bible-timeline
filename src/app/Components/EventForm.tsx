'use client';
import React, { useState } from 'react';
import { Event } from '../types/events';

type EventFormProps = {
  onAddEvent: (event: Event) => void;
};

export default function EventForm({ onAddEvent }: EventFormProps) {
  const [name, setName] = useState('');
  const [startPeriod, setStartPeriod] = useState('');
  const [finishPeriod, setFinishPeriod] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [meaning, setMeaning] = useState('');
  const [bibleText, setBibleText] = useState('');
  const [place, setPlace] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const resetForm = () => {
    setName('');
    setStartPeriod('');
    setFinishPeriod('');
    setLatitude('');
    setLongitude('');
    setMeaning('');
    setBibleText('');
    setPlace('');
    setAdditionalInfo('');
    setReferences([]);
  };

  const addEvent = () => {
    if (!startPeriod || !finishPeriod || !name) {
      alert('Please fill out all fields.');
      return;
    }

    const start = parseInt(startPeriod);
    const finish = parseInt(finishPeriod);

    if (isNaN(start) || isNaN(finish)) {
      alert('Invalid year format.');
      return;
    }

    const newEvent: Event = {
      name,
      start,
      finish,
      duration: finish - start,
      color: getRandomColor(),
      originalColor: getRandomColor(),
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      meaning,
      bibleText,
      place,
      additionalInfo,
      references,
    };

    onAddEvent(newEvent);
    resetForm();
    setShowModal(false); // Close the modal after adding the event
  };

  const cancelForm = () => {
    resetForm();
    setShowModal(false); // Close the modal after canceling
  };

  return (
    <div className='flex flex-col items-center justify-center pt-2'>

      {/* Button to open the modal */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-indigo-900 text-white p-3 px-6 font-bold rounded-md hover:bg-indigo-950 transition-all duration-300 ease-in-out"
      >
        Adicionar evento ou personagem
      </button>

      {/* Modal as a Bottom Sheet */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-60 z-[9999] flex justify-center items-end"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gray-900 w-full max-w-[95vw] min-h-[75vh] max-h-[95vh] rounded-t-2xl p-8 shadow-lg transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Adicionar evento ou acontecimento</h2>
            
            <div className='flex flex-row items-center justify-start gap-2 w-full'>
            {/* Event Name */}
            <div className='mb-4 w-full'>
              <h3 className="text-lg font-medium text-white mb-2">Event Name</h3>
              <input
                type="text"
                placeholder="Event Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Start Year */}
            <div className='mb-4 w-full'>
              <h3 className="text-lg font-medium text-white mb-2">Start Year</h3>
              <input
                type="number"
                placeholder="Start Year"
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Finish Year */}
            <div className='mb-4 w-full'>
              <h3 className="text-lg font-medium text-white mb-2">Finish Year</h3>
              <input
                type="number"
                placeholder="Finish Year"
                value={finishPeriod}
                onChange={(e) => setFinishPeriod(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            </div>

            <div className='flex flex-row items-center justify-start gap-2 w-full'>
            {/* Latitude */}
            <div className='mb-4 w-full'>
              <h3 className="text-lg font-medium text-white mb-2">Latitude (Optional)</h3>
              <input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Longitude */}
            <div className='mb-4 w-full'>
              <h3 className="text-lg font-medium text-white mb-2">Longitude (Optional)</h3>
              <input
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            </div>

            <div className='flex flex-row items-center justify-start gap-2 w-full'>
            {/* Meaning of Name */}
            <div className='mb-4 w-full'>
              <h3 className="text-lg font-medium text-white mb-2">Meaning of Name (Optional)</h3>
              <input
                type="text"
                placeholder="Meaning of Name"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Bible Text */}
            <div className='mb-4 w-full'>
              <h3 className="text-lg font-medium text-white mb-2">Bible Text (Optional)</h3>
              <input
                type="text"
                placeholder="Bible Text"
                value={bibleText}
                onChange={(e) => setBibleText(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Place */}
            <div className='mb-4 w-full'>
              <h3 className="text-lg font-medium text-white mb-2">Place (Optional)</h3>
              <input
                type="text"
                placeholder="Place"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            </div>

            <div className='flex flex-row items-center justify-start gap-2 w-full'>
            {/* Additional Info */}
            <div className='mb-4 w-full'>
              <h3 className="text-lg font-medium text-white mb-2">Additional Info (Optional)</h3>
              <input
                type="text"
                placeholder="Additional Info"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* References */}
            <div className='mb-6'>
              <h3 className="text-lg font-medium text-white mb-2">References</h3>
              <input
                type="text"
                placeholder="References"
                value={references.join(', ')}
                onChange={(e) => setReferences(e.target.value.split(',').map((name) => name.trim()))}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={addEvent}
                className="bg-green-600 text-white p-3 px-6 font-bold rounded-md hover:bg-green-700 transition"
              >
                Adicionar
              </button>
              <button
                onClick={cancelForm}
                className="bg-red-600 text-white p-3 px-6 font-bold rounded-md hover:bg-red-700 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
