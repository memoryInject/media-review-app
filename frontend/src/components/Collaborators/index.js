import React, { useState, useEffect } from 'react';
import {
  Offcanvas,
  Image,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import CollaboratorDetails from './CollaboratorDetails';
import UsersList from './UsersList';
import InvitationForm from './InvitationForm';
import Message from '../Message';

import {
  hideUICollaborator,
  listCollaborator,
} from '../../actions/collaboratorActions';

const Collaborators = () => {
  const dispatch = useDispatch();

  const [collabInfo, setCollabInfo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const collaboratorUI = useSelector((state) => state.collaboratorUI);
  const { showUI } = collaboratorUI;

  const collaboratorList = useSelector((state) => state.collaboratorList);
  const { collaborators, loading, error, reviewId } = collaboratorList;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  useEffect(() => {
    if (!collaborators && !loading) {
      dispatch(listCollaborator());
    }

    if (collaborators && review && !loading && reviewId !== review.id) {
      dispatch(listCollaborator());
    }
  }, [dispatch, collaborators, review, reviewId, loading]);

  useEffect(() => {
    setCollabInfo(null);
    setShowForm(false);
    setShowUsers(false);
  }, [showUI]);

  const collabInfoHandler = (collab) => {
    setCollabInfo(collab);
    setShowForm(false);
    setShowUsers(false);
  };

  const addCollabHandler = () => {
    setShowForm(true);
    setCollabInfo(null);
    setShowUsers(false);
  };

  const getUsersHandler = () => {
    setShowForm(false);
    setCollabInfo(null);
    setShowUsers(true);
  };

  return (
    <>
      <Offcanvas
        show={showUI}
        onHide={() => dispatch(hideUICollaborator())}
        placement='end'
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Collaborators
            {review && (
              <>
                <h6
                  style={{ fontSize: '14px', margin: '3px 0px' }}
                  className='text-muted'
                >
                  <span className='text-muted'>Review&nbsp; : </span>
                  {review.reviewName}
                </h6>
                <h6 style={{ fontSize: '14px' }} className='text-muted'>
                  <span className='text-muted'>Creator : </span>
                  {review.user.username}
                </h6>
              </>
            )}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/*Collaborator list*/}
          {error && <Message>{error}</Message>}
          <div>
            {collaborators &&
              collaborators.map((c, idx) => (
                <div key={idx} style={{ display: 'inline' }}>
                  <OverlayTrigger
                    placement='bottom'
                    overlay={
                      <Tooltip id='button-tooltip'>{c.username}</Tooltip>
                    }
                  >
                    <Image
                      data-cy={`profile-${c.username}`}
                      src={c.profile.imageUrl}
                      roundedCircle
                      style={{ height: '42px', cursor: 'pointer' }}
                      onClick={() => collabInfoHandler(c)}
                    />
                  </OverlayTrigger>
                  &nbsp;
                </div>
              ))}
          </div>

          {/*Add collaborator button*/}
          {user &&
            user.profile.isAdmin &&
            review &&
            review.user.id === user.id && (
              <div className='py-3'>
                <Dropdown className='my-2'>
                  <Dropdown.Toggle data-cy='add-collaborator' variant='outline-info' id='dropdown-basic'>
                    Add Collaborator
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item data-cy='add-existing-user' onClick={getUsersHandler}>
                      Add existing user
                    </Dropdown.Item>
                    <Dropdown.Item data-cy='send-invitation' onClick={() => addCollabHandler()}>
                      Send invitation
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}

          {/*Show collaborator info when click the profile*/}
          {collabInfo && <CollaboratorDetails collaborator={collabInfo} />}

          {/*Email invitation form to add new collaborator*/}
          {showForm && <InvitationForm />}

          {/* Add existing user list */}
          {showUsers && <UsersList />}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Collaborators;
