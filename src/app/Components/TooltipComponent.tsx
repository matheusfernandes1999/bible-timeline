'use client';
import { useState } from "react";
import { IoClose } from "react-icons/io5";

type TooltipProps = {
  tooltip: { visible: boolean; x: number; y: number; text: string; references?: string[] } | null;
  onClose: () => void;
};

const TooltipComponent: React.FC<TooltipProps> = ({ tooltip, onClose }) => {
  if (!tooltip?.visible) return null;
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-end z-[999]">
      <div
        id="modalNotification"
        className={`bg-gray-900 w-full max-w-[80vw] min-h-[70vh] max-h-[90vh] rounded-t-2xl p-6 overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out ${
          isAnimating ? 'animate-slideDown' : 'animate-slideUp'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-white">Event Details</h1>
          <IoClose
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-blue-600 w-7 h-7 ease-in-out duration-300"
          />
        </div>
        
        {/* Event Text */}
        <div className="text-white mb-4">
          <p className="text-md">{tooltip.text}</p>
        </div>

        {/* References Section */}
        {tooltip.references && tooltip.references.length > 0 && (
          <div className="text-white">
            <h2 className="font-semibold text-lg mb-2">References</h2>
            <ul className="list-disc pl-5 space-y-2">
              {tooltip.references.map((reference, index) => (
                <li key={index} className="text-white">{reference}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TooltipComponent;
