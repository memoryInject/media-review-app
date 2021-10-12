import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Project from '../components/Project';
import { listProjects } from '../actions/projectActions';

const ProjectListScreen = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const projectList = useSelector((state) => state.projectList);
  const { loading, error, projects } = projectList;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listProjects());
    }
  }, [history, userInfo, dispatch]);

  return (
    <>
      <h4>PROJECTS</h4>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row xs='auto'>
          {projects.map((project) => (
            <Col key={project.id.toString()}>
              <Project project={project} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default ProjectListScreen;
