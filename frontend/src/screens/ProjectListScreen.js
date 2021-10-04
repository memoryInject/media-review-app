import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Project from '../components/Project';
import { listProjects } from '../actions/projectActions';

const ProjectListScreen = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const projectList = useSelector((state) => state.projectList);
  const { projects } = projectList;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listProjects())
    }
  }, [history, userInfo, dispatch]);

  return (
    <div>
      <h4>PROJECTS</h4>
      <Row>
        {projects.map((project) => (
          <Col sm={12} md={6} lg={4} xl={4} key={project.id.toString()}>
            <Project project={project} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProjectListScreen;
