import React, { useEffect } from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from './Message';
import Loader from './Loader';
import Paginate from './Paginate';

import {
  listProjects,
  listProjectsPagination,
} from '../actions/projectActions';

const ProjectListTable = ({ history }) => {
  const dispatch = useDispatch();

  const projectList = useSelector((state) => state.projectList);
  const { loading, projects, error } = projectList;

  useEffect(() => {
    if (!projects && !loading) {
      dispatch(listProjects());
    }
  }, [projects, dispatch, loading]);

  const openProjectHandler = (id) => {
    history.push(`/projects/${id}`);
  };

  const settingsProjectHandler = (id) => {
    history.push(`/projects/${id}/settings`);
  };

  const buttonStyle = {
    cursor: 'pointer',
  };

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
        Project list
      </h6>
      <div className='table-responsive'>
        <Table striped bordered hover className='align-middle'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Project Name</th>
              <th>Creator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects &&
              projects.results.map((project, idx) => (
                <tr key={idx}>
                  <td>{project.id}</td>
                  <td>{project.projectName}</td>
                  <td>{project.user.username}</td>
                  <td>
                    <span
                      onClick={() => openProjectHandler(project.id)}
                      className='material-icons-round text-info noselect'
                      style={buttonStyle}
                    >
                      launch
                    </span>
                    <span
                      onClick={() => settingsProjectHandler(project.id)}
                      className='material-icons-round text-light noselect px-1'
                      style={buttonStyle}
                    >
                      settings
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <Row>
        <Col className='d-flex justify-content-center'>
          {projects && (
            <Paginate data={projects} action={listProjectsPagination} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProjectListTable;
