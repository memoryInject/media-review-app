import React, { useState, useEffect } from 'react';
import {
  InputGroup,
  ListGroup,
  FormControl,
  Image,
  Button,
  Spinner,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { usersCollaborator } from '../../actions/collaboratorActions';

import Message from '../Message';

const UsersList = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');

  const collaboratorUsers = useSelector((state) => state.collaboratorUsers);

  const { loading, users, error } = collaboratorUsers;

  useEffect(() => {
    dispatch(usersCollaborator(name));
  }, [name, dispatch]);

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
      {loading ? (
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
      ) : (
        users && (
          <ListGroup as='ol'>
            {users.map((user, idx) => (
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
                <Button variant='outline-info' size='sm'>
                  <span
                    className='material-icons-round'
                    style={{
                      fontSize: '20px',
                      transform: 'translate(0, 2px)',
                    }}
                  >
                    person_add_alt
                  </span>
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )
      )}
    </>
  );
};

export default UsersList;
