'use client';
import React, { useEffect, useState } from 'react';
import { Event } from '../types/events';

// Firebase
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../../../firebase';
import { IoClose } from 'react-icons/io5';

export default function EventForm() {
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
  const [existingEvents, setExistingEvents] = useState<Event[]>([]);
  const [existingReferences, setExistingReferences] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLink, setMapLink] = useState('');  // New state for map link
  const [eventType, setEventType] = useState('profeta');

  useEffect(() => {
    // Fetch all events and references to populate the references search
    const fetchData = async () => {
      try {
        // Get events
        const querySnapshot = await getDocs(collection(db, "events"));
        const events = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        })) as Event[];

        // Get references
        const referencesSnapshot = await getDocs(collection(db, "references"));
        const references = referencesSnapshot.docs.map((doc) => doc.data().name);

        setExistingEvents(events);
        setExistingReferences(references);
      } catch (error) {
        console.error("Error fetching events and references from Firestore: ", error);
      }
    };

    fetchData();
  }, []);

  // Combine events and references in the filtered results
  const filteredReferences = [
    ...existingEvents.map(event => event.name),
    ...existingReferences
  ].filter(ref => ref.toLowerCase().includes(searchQuery.toLowerCase()));

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
    setSearchQuery('');
    setMapLink('');
    setEventType(''); 
  };

  const addEvent = async () => {
    if (!startPeriod || !finishPeriod || !name) {
      alert("Please fill out all fields.");
      return;
    }
  
    const start = parseInt(startPeriod);
    const finish = parseInt(finishPeriod);
  
    if (isNaN(start) || isNaN(finish)) {
      alert("Invalid year format.");
      return;
    }
  
    const newEvent = {
      name,
      start,
      finish,
      duration: finish - start,
      color: getRandomColor(),
      originalColor: getRandomColor(),
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      meaning,
      bibleText,
      place,
      additionalInfo,
      references,
      mapLink,  // Save the map link
      eventType,  // Save the event type
    };
  
    try {
      await addDoc(collection(db, "events"), newEvent);
      alert("Event added successfully!");
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Failed to add event.");
    }
  };

  const createReference = async (name: string) => {
    try {
      // Create a new reference
      await addDoc(collection(db, "references"), { name });
      alert("Reference created successfully!");
      const referencesSnapshot = await getDocs(collection(db, "references"));
      const references = referencesSnapshot.docs.map((doc) => doc.data().name);
      setExistingReferences(references); 
    } catch (error) {
      console.error("Error creating reference: ", error);
      alert("Failed to create reference.");
    }
  };

  const removeReference = (reference: string) => {
    setReferences(references.filter(ref => ref !== reference));
  };

  const referencesToShow = filteredReferences.slice(0, 3);

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
          onClick={() => { setShowModal(false); resetForm(); }}
        >
          <div
            className="bg-gray-900 w-full max-w-[95vw] min-h-[95vh] max-h-[100vh] rounded-t-2xl p-4 shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Adicionar evento ou acontecimento</h2>
            <IoClose
                onClick={() => setShowModal(false)}
                className="cursor-pointer absolute top-5 right-5 text-white hover:text-blue-600 w-7 h-7 ease-in-out duration-300"
              />
            <div className='flex flex-row items-center justify-start gap-2 w-full'>
              {/* Event Name */}
              <div className='mb-4 w-full'>
                <h3 className="text-lg font-medium text-white mb-2">Nome</h3>
                <input
                  type="text"
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Start Year */}
              <div className='mb-4 w-full'>
                <h3 className="text-lg font-medium text-white mb-2">Data inicial</h3>
                <input
                  type="number"
                  placeholder="Data inicial"
                  value={startPeriod}
                  onChange={(e) => setStartPeriod(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Finish Year */}
              <div className='mb-4 w-full'>
                <h3 className="text-lg font-medium text-white mb-2">Data final</h3>
                <input
                  type="number"
                  placeholder="Data final"
                  value={finishPeriod}
                  onChange={(e) => setFinishPeriod(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className='flex flex-row items-center justify-start gap-2 w-full'>
              {/* Latitude */}
              <div className='mb-4 w-full'>
                <h3 className="text-lg font-medium text-white mb-2">Latitude (Opcional)</h3>
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
                <h3 className="text-lg font-medium text-white mb-2">Longitude (Opcional)</h3>
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
                <h3 className="text-lg font-medium text-white mb-2">Significado do nome (Opcional)</h3>
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
                <h3 className="text-lg font-medium text-white mb-2">Texto Bíblico (Opcional)</h3>
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
                <h3 className="text-lg font-medium text-white mb-2">Lugar (Opcional)</h3>
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
                <h3 className="text-lg font-medium text-white mb-2">Informação adicional (Opcional)</h3>
                <input
                  type="text"
                  placeholder="Informação adicional"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className='mb-4 w-full'>
                <h3 className="text-lg font-medium text-white mb-2">Tipo de evento</h3>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="profeta">Profeta</option>
                  <option value="cidade">Cidade</option>
                  <option value="acontecimento">Acontecimento</option>
                  <option value="reino">Reino</option>
                  <option value="personagem">Personagem</option>
                  <option value="profecia">Profecia</option>
                </select>
              </div>

              <div className='mb-4 w-full'>
                <h3 className="text-lg font-medium text-white mb-2">Link para mapa (Opcional)</h3>
                <input
                  type="url"
                  placeholder="Link para mapa"
                  value={mapLink}
                  onChange={(e) => setMapLink(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* References */}
            <div className='w-full flex flex-row items-end justify-start gap-2'>
              <div className='flex flex-col items-start'>
                <h3 className="text-lg font-medium text-white">Referências</h3>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Procurar referências"
                />
              </div>
              <div className='flex flex-row gap-1'>
                {filteredReferences.length > 0 ? (
                  referencesToShow.map((ref, index) => (
                    <button
                      key={index}
                      onClick={() => setReferences([...references, ref])}
                      disabled={references.includes(ref)}
                      className={`text-white px-2 py-2 rounded-md ${references.includes(ref) ? 'bg-gray-400 cursor-not-allowed hidden' : 'bg-gray-800 hover:bg-gray-900'}`}
                    >
                      {ref}
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => createReference(searchQuery)}
                    className="block text-white bg-green-600 hover:bg-green-700 p-2 rounded-md w-full"
                  >
                    Criar a referência: {searchQuery}
                  </button>
                )}
              </div>
              {/* Show Selected References */}
              <div className='flex flex-col items-start'>
                <h3 className="text-lg font-medium text-white">{references.length > 0 && (<h3 className="text-lg font-medium text-white">Referências selecionadas</h3>)}</h3>
                <div className="flex flex-row flex-wrap gap-2">
                  {references.map((ref, index) => (
                    <span
                      key={index}
                      className="bg-gray-600 text-white rounded-md px-2 py-2 flex items-center gap-2"
                    >
                      {ref}
                      <IoClose
                        onClick={() => removeReference(ref)}
                        className="cursor-pointer text-white"
                      />
                    </span>
                  ))}
                </div>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
