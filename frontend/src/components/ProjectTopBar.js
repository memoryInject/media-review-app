import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import svgTopography from '../utils/svgTopography';

const ProjectTopBar = ({ settingsHandler }) => {
  const projectDetails = useSelector((state) => state.projectDetails);
  const { project } = projectDetails;

  return (
    <Row
      className='py-1 m-0 bg-dark'
      style={{
        //border: '1px solid #3A3A3A',
        borderRadius: '0.25rem',
        marginLeft: '0.1rem',
        marginRight: '0.1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className='project-top-bar'
        style={{
          position: 'absolute',
          backgroundImage: `url("${
            project.imageUrl ? project.imageUrl : svgTopography
          }")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          top: '0px',
          height: '50%',
          opacity: '0.3',
        }}
      ></div>
      <div className='project-top-bar-gradient'></div>

      <Col md className='text-light'>
        <div
          style={{
            zIndex: '3',
            borderRadius: '0.25rem',
            padding: '0.05rem',
            position: 'relative',
          }}
        >
          <h4 style={{ transform: 'translate(0px, 0)' }}>
            <span
              className='material-icons-round noselect'
              style={{
                position: 'relative',
                top: '4px',
                fontSize: '25px',
                color: `${project.color}`,
              }}
            >
              circle
            </span>
            &nbsp;
            {project.projectName}
          </h4>
        </div>
      </Col>
      <Col md className='text-end'>
        <div
          style={{
            transform: 'translate(11px, 2px)',
            padding: '0.2rem',
            display: 'inline-block',
          }}
        >
          <Button
            onClick={settingsHandler}
            variant='secondary'
            size='sm'
            style={{ paddingTop: '0px' }}
          >
            <span
              className='material-icons-round'
              style={{
                position: 'relative',
                top: '4px',
                fontSize: '20px',
              }}
            >
              settings
            </span>
            &nbsp; Settings
          </Button>
          <Button
            variant='secondary'
            size='sm'
            className='mx-2'
            style={{ paddingTop: '0px' }}
          >
            <span
              className='material-icons-round'
              style={{
                position: 'relative',
                top: '4px',
                fontSize: '20px',
              }}
            >
              ondemand_video
            </span>
            &nbsp; Reviews
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default ProjectTopBar;
