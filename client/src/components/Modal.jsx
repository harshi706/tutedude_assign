import React, { useState } from "react";
import Requests from "./Requests";


const Modal = ({buttonText,comp}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col bg-gray-100">
      {/* Button to trigger modal */}
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-all"
      >
        {buttonText}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="modal-container bg-white p-6 rounded-lg shadow-md"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            {comp}
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
