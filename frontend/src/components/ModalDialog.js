import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ModalDialog = ({ title, content, callback, state, stateCallback }) => {
  const handleClose = () => stateCallback(false);
  const confirm = () => {
    callback();
    handleClose();
  };

  return (
    <>
      <Modal
        show={state}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span
              className='material-icons-round'
              style={{ transform: 'translate(0, 4px)' }}
            >
              movie
            </span>
            {` ${title}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{content}</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={confirm}>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDialog;
