import React, { useState, useEffect } from 'react';
import {
  InputGroup,
  ListGroup,
  FormControl,
  Image,
  Button,
  Spinner,
  Form,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../Message';
import {
  usersCollaborator,
  addCollaborator,
  hideUICollaborator,
  listCollaborator,
} from '../../actions/collaboratorActions';
import {
  showToast,
  messageToast,
  variantToast,
} from '../../actions/toastActions';
import { COLLABORATOR_ADD_RESET } from '../../constants/collaboratorConstants';

const UsersList = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [userAdd, setUserAdd] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const collaboratorUsers = useSelector((state) => state.collaboratorUsers);
  const { loading, users, error } = collaboratorUsers;

  const collaboratorAdd = useSelector((state) => state.collaboratorAdd);
  const {
    loading: loadingCollaboratorAdd,
    success: successCollaboratorAdd,
    error: errorCollaboratorAdd,
  } = collaboratorAdd;

  // When this component mounts reset userAdd array
  useEffect(() => {
    setUserAdd([]);
  }, []);

  // This will isolate users from collaborators
  useEffect(() => {
    if (users && review) {
      const existingCollaboratorIds = review.collaborators.map(
        (collab) => collab.id
      );
      const uniqueUsers = users.filter(
        (user) => !existingCollaboratorIds.includes(user.id)
      );
      setFilterUsers(uniqueUsers);
    }
  }, [users, review]);

  // Fetch all users from backend
  useEffect(() => {
    dispatch(usersCollaborator(name));
  }, [name, dispatch]);

  // After successfully update collaborators
  useEffect(() => {
    if (successCollaboratorAdd && review) {
      dispatch(messageToast('Successfully added users.'));
      dispatch(variantToast('success'));
      dispatch(showToast());
      dispatch({ type: COLLABORATOR_ADD_RESET });
      dispatch(listCollaborator());
      dispatch(hideUICollaborator());
    }
  }, [successCollaboratorAdd, review, dispatch]);

  const addUserHandler = (e, user) => {
    if (!e.target.checked) {
      const filteredUserAdd = userAdd.filter((u) => u !== user.id);
      setUserAdd(filteredUserAdd);
    } else {
      if (!userAdd.includes(user.id)) {
        setUserAdd([...userAdd, user.id]);
      }
    }
  };

  const submitHandler = () => {
    dispatch(addCollaborator(userAdd));
  };

  return (
    <>
      <InputGroup className='mb-3'>
        <InputGroup.Text id='basic-addon1'>
          <span className='material-icons-round'>person_search</span>
        </InputGroup.Text>
        <FormControl
          placeholder='Username'
          aria-label='Username'
          aria-describedby='basic-addon1'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </InputGroup>
      {loading || loadingCollaboratorAdd ? (
        <div className='d-flex justify-content-center'>
          <Spinner
            animation='border'
            style={{
              transition: 'all 0.5s ease-in-out',
            }}
          />
        </div>
      ) : error ? (
        <Message>{error}</Message>
      ) : errorCollaboratorAdd ? (
        <Message>{errorCollaboratorAdd}</Message>
      ) : (
        users && (
          <>
            <div className='d-flex justify-content-center py-2'>
              <Button
                variant='info'
                size='sm'
                onClick={submitHandler}
                disabled={userAdd.length > 0 ? false : true}
              >
                <span
                  className='material-icons-round'
                  style={{
                    fontSize: '20px',
                    transform: 'translate(0, 3px)',
                  }}
                >
                  person_add_alt
                </span>
                &nbsp; Add selected users
              </Button>
            </div>
            <ListGroup as='ol'>
              {filterUsers.map((user, idx) => (
                <ListGroup.Item
                  key={idx}
                  as='li'
                  className='d-flex justify-content-between align-items-start'
                >
                  <Image
                    src={user.profile.imageUrl}
                    roundedCircle
                    style={{ height: '28px' }}
                  />
                  <div className='ms-2 me-auto'>
                    <div className='fw-bold'>{user.username}</div>
                    <span className='text-muted'>{user.email}</span>
                  </div>
                  <Form>
                    <Form.Group className='mb-3' controlId='formBasicCheckbox'>
                      <Form.Check
                        type='checkbox'
                        onChange={(e) => addUserHandler(e, user)}
                      />
                    </Form.Group>
                  </Form>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )
      )}
    </>
  );
};

export default UsersList;
