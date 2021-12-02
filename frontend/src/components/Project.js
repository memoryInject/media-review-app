import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Project = ({ project }) => {
  const placeholderUrl = '/static/placeholder.png'
  //const placeholderUrl = 'https://www.btklsby.go.id/images/placeholder/basic.png';  

  return (
    <Card className='my-3 rounded project-card'>
      <Link to={`/projects/${project.id}`} style={{ position: 'relative' }}>
        <Card.Img
          alt='project image'
          src={project.imageUrl ? project.imageUrl : placeholderUrl}
          className='project-img'
          style={{ opacity: `${project.imageUrl ? '1' : '0.4'}` }}
        />
      </Link>
      <span
        style={{
          position: 'absolute',
          bottom: '45px',
          right: '10px',
          color: `${project.color}`,
          fontSize: '32px',
        }}
        className='material-icons-round noselect'
      >
        circle
      </span>
      <Card.Body>
        <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
          <Card.Title className='title-card'>{project.projectName}</Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Project;
