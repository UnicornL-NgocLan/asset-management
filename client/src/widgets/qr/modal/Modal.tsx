import React from 'react'
import Rodal from 'rodal';
import './Modal.css';

const customStyles = {
  height: 'auto',
  bottom: 'auto',
  top: '20%',
};

const Modal = ({ isOpen, title, closeModal, children, footer }:any) => {

  const closeModalHandler = (event:any) => {
    closeModal?.();
  };

  return (
    <Rodal
      visible={isOpen}
      animation="zoom"
      onClose={closeModalHandler}
      customStyles={customStyles}
    >
      <div className="modal">
        <div className="modal__header">
          <div className="modal__title">
            <p>{title}</p>
          </div>
        </div>

        <div className="modal__content">{children}</div>
        <div className="modal__footer">{footer}</div>
      </div>
    </Rodal>
  );
};

export default Modal;