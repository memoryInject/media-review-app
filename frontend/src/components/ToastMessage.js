import React from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { hideToast } from '../actions/toastActions';

const ToastMessage = () => {
  const dispatch = useDispatch();

  const toastDetails = useSelector((state) => state.toastDetails);
  const { showUI, message, variant } = toastDetails;

  return (
    <ToastContainer position='bottom-center' className='p-3' style={{zIndex: '300'}}>
      <Toast
        onClose={() => dispatch(hideToast())}
        show={showUI}
        delay={3000}
        autohide
        bg={variant}
      >
        <Toast.Header>
          <span className='material-icons-round'>movie</span>
          <strong className='me-auto'>&nbsp;Media-Review</strong>
          <small className='text-muted'>just now</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastMessage;
