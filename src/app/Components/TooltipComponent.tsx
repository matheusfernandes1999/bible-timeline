'use client';
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { db } from "../../../firebase";
import SafeTooltipMap from "./SafeTooltipMap";

type TooltipProps = {
  tooltip: { visible: boolean; id: string } | null;
  onClose: () => void;
};

const TooltipComponent: React.FC<TooltipProps> = ({ tooltip, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<any>(null);

  useEffect(() => {
    if (tooltip?.id) {
      const eventId = tooltip.id;
      if (eventId) {
        const fetchEventDetails = async () => {
          try {
            const eventDoc = await getDoc(doc(db, "events", eventId));
            if (eventDoc.exists()) {
              const data = eventDoc.data();
              setEventDetails(data);
              setEditedEvent(data); // Set initial state for editing
            } else {
              console.error("Event not found");
            }
          } catch (error) {
            console.error("Error fetching event details: ", error);
          }
        };

        fetchEventDetails();
      }
    }
  }, [tooltip]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEvent((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (tooltip?.id && editedEvent) {
      try {
        await updateDoc(doc(db, "events", tooltip.id), editedEvent);
        setIsEditing(false); // Exit edit mode
        setEventDetails(editedEvent); // Update details with new values
      } catch (error) {
        console.error("Error updating event details: ", error);
      }
    }
  };

  if (!tooltip?.visible) return null;

  // Render loading state or event details when they are available
  if (!eventDetails) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[9999]">
        <div className="bg-gray-900 w-full max-w-[100vw] min-h-[85vh] max-h-[95vh] rounded-t-2xl p-6 overflow-y-auto shadow-lg text-white">
          <p>Carregando informações do evento...</p>
        </div>
      </div>
    );
  }
    
  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-end z-[9999]">
        <div
          id="modalNotification"
          className={`bg-gray-900 w-max max-w-[100vw] min-h-[85vh] max-h-[95vh] rounded-t-2xl p-6 overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out ${
            isAnimating ? 'animate-slideDown' : 'animate-slideUp'
          }`}
        >
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-xl font-bold text-white text-center">{isEditing ? 'Editar Evento' : 'Detalhes do Evento'}</h1>
            <IoClose
              onClick={onClose}
              className="cursor-pointer absolute top-5 right-5 text-white hover:text-blue-600 w-7 h-7 ease-in-out duration-300"
            />
          </div>

          <div className="p-2 flex flex-col items-center">
            {isEditing ? (
              <div className="flex flex-col items-center gap-2">
                <div className='flex flex-row items-center justify-start gap-2 w-full'>
                  <div className="flex flex-col items-start w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">Evento ou Nome</label>
                    <input
                      type="text"
                      name="Evento ou Nome"
                      value={editedEvent.name || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex flex-col items-start w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">Data inicial</label>
                    <input
                      type="text"
                      name="Data inicial"
                      value={editedEvent.start || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex flex-col items-start w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">Data final</label>
                    <input
                      type="text"
                      name="Data final"
                      value={editedEvent.finish || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className='flex flex-row items-center justify-start gap-2 w-full'>
                  <div className="flex flex-col items-start w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">Significado do nome ou lugar</label>
                    <input
                      type="text"
                      name="Significado do nome ou lugar"
                      value={editedEvent.meaning || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>  

                  <div className="flex flex-col items-start w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">Referência bíblica</label>
                    <input
                      type="text"
                      name="Referência bíblica"
                      value={editedEvent.bibleText || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex flex-col items-start w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">Localização</label>
                    <input
                      type="text"
                      name="Localização"
                      value={editedEvent.place || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>  
                </div>
                
                <div className='flex flex-col items-start w-full'>
                  <label className="block mb-2 text-sm font-medium text-gray-300">Informação adicional</label>
                  <input
                    type="text"
                    name="Informação adicional"
                    value={editedEvent.additionalInfo || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                <div className='flex flex-col items-start w-full'>
                  <label className="block mb-2 text-sm font-medium text-gray-300">Referências</label>
                  <input
                    type="text"
                    name="Referências"
                    value={editedEvent.references || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
              </div>
            ) : (
              <div className="flex flex-row items-start justify-around w-[60vw]">
                <div className="flex flex-col items-start gap-2 text-white w-full">
                  <div className="flex flex-row items-center gap-2 w-full">
                    <p className="font-bold">Nome: </p><span>{eventDetails.name}</span>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <p className="font-bold">Data de início: </p><span>{eventDetails.start}</span>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <p className="font-bold">Data final: </p><span>{eventDetails.finish}</span>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <p className="font-bold">Significado: </p><span>{eventDetails.meaning || 'Não informado'}</span>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <p className="font-bold">Localização: </p><span>{eventDetails.place || 'Não informado'}</span>
                  </div>

                  <div className="flex flex-row items-center gap-2 w-full">
                    <p className="font-bold">Informação adicional: </p><span>{eventDetails.additionalInfo || 'Não informado'}</span>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    {eventDetails.references.length > 0 && (
                      <h3 className="text-lg font-bold text-white">Referências selecionadas:</h3>
                    )}
                    <div className="text-white">
                      {eventDetails.references.length > 0
                        ? `${eventDetails.references.join(', ')}.`
                        : 'Sem referências.'}
                    </div>
                  </div>

                </div>
                <div className="w-full rounded-md">
                  {/* Check if latitude and longitude are filled */}
                  {eventDetails?.latitude && eventDetails?.longitude && eventDetails?.mapLink ? (
                    <SafeTooltipMap mapLink={eventDetails?.mapLink} latitude={eventDetails.latitude} longitude={eventDetails.longitude} />
                  ) : (
                    <p className="text-gray-400 w-full">Localização não informada.</p>
                  )}
                </div>

              </div>
            )}
            <div className="flex flex-row items-end justify-center mt-6 w-full gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 px-4 py-2 rounded-md bg-indigo-700 text-white font-bold"
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>

              {isEditing && (
                <button
                  onClick={handleSave}
                  className="mt-4 px-4 py-2 rounded-md bg-green-500 text-white font-bold"
                >
                  Salvar
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TooltipComponent;
