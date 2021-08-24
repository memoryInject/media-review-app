import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Project = ({ project }) => {
  return (
    <Card className='my-3 rounded project-card'>
      <Link to={`/projects/${project.id}/reviews`}>
        <Card.Img src={project.imageUrl} className='project-img' />
      </Link>
      <Card.Body>
        <Link to={`/projects/${project.id}/reviews`}>
          <Card.Title>{project.name}</Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Project;
