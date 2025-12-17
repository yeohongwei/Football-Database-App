import React from 'react';
import styles from './Modal.module.css';

const RemovePlayerModal = ({ isOpen, onClose, onConfirm, playerName }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <p>Player {playerName} will be removed from favourites. Do you wish to proceed?</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
};

export default RemovePlayerModal;
