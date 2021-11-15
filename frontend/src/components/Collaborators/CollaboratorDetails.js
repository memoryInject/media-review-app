import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import ModalDialog from '../ModalDialog';
import Message from '../Message';
import {
  showToast,
  messageToast,
  variantToast,
} from '../../actions/toastActions';
import {
  removeCollaborator,
  hideUICollaborator,
  listCollaborator,
} from '../../actions/collaboratorActions';
import {
  COLLABORATOR_REMOVE_RESET,
  COLLABORATOR_REMOVE_USER,
} from '../../constants/collaboratorConstants';

const CollaboratorDetails = ({ collaborator }) => {
  const dispatch = useDispatch();

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const collaboratorRemove = useSelector((state) => state.collaboratorRemove);
  const { collaboratorToRemove, loading, error, success } = collaboratorRemove;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Run this after the confirm from ModelDialog
  useEffect(() => {
    if (confirmDelete && collaboratorToRemove) {
      dispatch(removeCollaborator(collaboratorToRemove));
      setConfirmDelete(false);
    }
  }, [confirmDelete, collaboratorToRemove, dispatch]);

  // Run this after the collaborator delete is successful
  useEffect(() => {
    if (success) {
      dispatch(messageToast('Successfully removed collaborator.'));
      dispatch(variantToast('success'));
      dispatch(showToast());
      dispatch({ type: COLLABORATOR_REMOVE_RESET });
      dispatch(listCollaborator());
      dispatch(hideUICollaborator());
    }
  }, [success, review, dispatch]);

  const confirmDeleteHandler = () => {
    setConfirmDelete(true);
  };

  const removeCollaboratorHandler = (collaborator) => {
    dispatch({ type: COLLABORATOR_REMOVE_USER, payload: collaborator.id });
    setShowModal(true);
  };

  return (
    <>
      {error && <Message>{error}</Message>}
      {loading ? (
        <div className='d-flex justify-content-center'>
          <Spinner
            animation='border'
            style={{
              transition: 'all 0.5s ease-in-out',
            }}
          />
        </div>
      ) : (
        <>
          <ListGroup as='ol'>
            <ListGroup.Item
              as='li'
              className='d-flex justify-content-between align-items-start'
            >
              <div className='ms-2 me-auto'>
                <div className='fw-bold text-secondary'>Username</div>
                {collaborator.username}
              </div>
            </ListGroup.Item>
            <ListGroup.Item
              as='li'
              className='d-flex justify-content-between align-items-start'
            >
              <div className='ms-2 me-auto'>
                <div className='fw-bold text-secondary'>Email</div>
                {collaborator.email}
              </div>
            </ListGroup.Item>
            <ListGroup.Item
              as='li'
              className='d-flex justify-content-between align-items-start'
            >
              <div className='ms-2 me-auto'>
                <div className='fw-bold text-secondary'>First name</div>
                {collaborator.firstName}
              </div>
            </ListGroup.Item>
            <ListGroup.Item
              as='li'
              className='d-flex justify-content-between align-items-start'
            >
              <div className='ms-2 me-auto'>
                <div className='fw-bold text-secondary'>Last name</div>
                {collaborator.lastName}
              </div>
            </ListGroup.Item>
            <ListGroup.Item
              as='li'
              className='d-flex justify-content-between align-items-start'
            >
              <div className='ms-2 me-auto'>
                <div className='fw-bold text-secondary'>Company name</div>
                {collaborator.profile.companyName}
              </div>
            </ListGroup.Item>
            {collaborator.profile.isAdmin && (
              <ListGroup.Item
                as='li'
                className='d-flex justify-content-between align-items-start'
                variant='warning'
              >
                <div className='ms-2 me-auto'>
                  <div className='fw-bold'>Admin access</div>
                  True
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
          {review.user.id !== collaborator.id && review.user.id === user.id && (
            <Button
              variant='danger'
              className='my-2'
              onClick={() => removeCollaboratorHandler(collaborator)}
            >
              Remove
            </Button>
          )}
        </>
      )}

      {/*Confirm dialog for collaborator remove*/}
      <ModalDialog
        title='Remove Collaborator'
        content={`This will remove "${collaborator.username}" from this review!`}
        state={showModal}
        stateCallback={setShowModal}
        callback={confirmDeleteHandler}
      />
    </>
  );
};

export default CollaboratorDetails;
