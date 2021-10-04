import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Project from '../components/Project';
import projects from '../projects';

const ProjectScreen = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
  }, [history, userInfo]);

  return (
    <div>
      <h1>Projects screen</h1>
      <Row>
        {projects.map((project) => (
          <Col sm={12} md={6} lg={4} xl={3}>
            <Project project={project} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProjectScreen;
