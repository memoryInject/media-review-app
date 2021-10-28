import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Project = ({ project }) => {
  const placeholderUrl =
    'https://www.btklsby.go.id/images/placeholder/basic.png';
  return (
    <Card className='my-3 rounded project-card'>
      <Link to={`/projects/${project.id}`}>
        <Card.Img
          src={project.imageUrl ? project.imageUrl : placeholderUrl}
          className='project-img'
          style={{opacity: `${project.imageUrl ? '1' : '0.4'}`}}
        />
      </Link>
      <Card.Body>
        <Link to={`/projects/${project.id}`} style={{textDecoration: 'none'}}>
          <Card.Title>{project.projectName}</Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Project;
