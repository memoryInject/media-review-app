import React from 'react';
import { Col, Row } from 'react-bootstrap';

import Project from '../components/Project';
import projects from '../projects';

const ProjectScreen = () => {
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
