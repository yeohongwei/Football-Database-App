import React from 'react';

const RemovePlayerModal = ({ isOpen, onClose, onConfirm, playerName }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white max-w-sm mx-auto">
        <p className="mb-4">Player {playerName} will be removed from favourites. Do you wish to proceed?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-semibold"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemovePlayerModal;
