import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Project = ({ project }) => {
  return (
    <Card className='my-3 rounded project-card'>
      <Link to={`/projects/${project.id}`}>
        <Card.Img src={project.imageUrl} className='project-img' />
      </Link>
      <Card.Body>
        <Link to={`/projects/${project.id}`}>
          <Card.Title>{project.projectName}</Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Project;
