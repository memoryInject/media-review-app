import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from './Message';
import Loader from './Loader';

import { listUser } from '../actions/userActions';

const UserListTable = () => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, users, error } = userList;

  useEffect(() => {
    if (!users && !loading) {
      dispatch(listUser());
    }
  }, [users, dispatch, loading]);

  return (
    <>
      {loading && <Loader />}
      {error && <Message>{error}</Message>}
      <h6 className='text-light'>
        <span
          style={{ position: 'relative', top: '6px' }}
          className='material-icons-round'
        >
          view_list
        </span>
        User list
      </h6>
      <div className='table-responsive'>
        <Table striped bordered hover className='align-middle'>
          <thead>
            <tr>
              <th>Id</th>
              <th>User Name</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Company Name</th>
              <th>Admin Access</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, idx) => (
                <tr key={idx}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    {user.profile.companyName && user.profile.companyName}
                  </td>
                  <td>
                    {user.profile.isAdmin ? (
                      <span className='material-icons-round text-success'>
                        check_box
                      </span>
                    ) : (
                      <span className='material-icons-round text-danger'>
                        disabled_by_default
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default UserListTable;
