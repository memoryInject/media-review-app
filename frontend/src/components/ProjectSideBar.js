import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import Loader from './Loader';

const ProjectSideBar = ({ id, settingsHandler }) => {
  const projectDetails = useSelector((state) => state.projectDetails);
  const { loading, project } = projectDetails;

  const placeholderUrl =
    'https://www.btklsby.go.id/images/placeholder/basic.png';

  return (
    <div
      className='bg-dark'
      style={{
        height: '91vh',
        borderRadius: '0.25rem',
        position: 'fixed',
        width: '16rem',
        overflowX: 'hidden',
        transition: 'all 0.5s ease-in-out',
      }}
    >
      {(loading && !project) ||
      (!loading && !project) ||
      project.id.toString() !== id.toString() ? (
        <div className='d-flex justify-content-center py-4'>
          <Loader />
        </div>
      ) : (
        <>
          <Image
            src={project.imageUrl ? project.imageUrl : placeholderUrl}
            className='project-bar-img'
            style={{opacity: `${project.imageUrl ? '1' : '0.4'}`}}
          />
          <div className='project-bar-gradient'></div>
          <h5 className='px-2' style={{ position: 'relative', top: '-25px' }}>
            {project.projectName}
          </h5>
          <div className='text-end p-0 m-0' style={{ position: 'relative' }}>
            <span
              className='material-icons-round text-primary'
              style={{
                position: 'relative',
                top: '-20px',
                left: '-6px',
                fontSize: '34px',
              }}
            >
              circle
            </span>
          </div>
          <div className='px-2'>
            <Button
              size='sm'
              variant='secondary'
              style={{ paddingTop: '0px', width: '100%' }}
            >
              <span
                className='material-icons-round'
                style={{
                  position: 'relative',
                  top: '5px',
                  fontSize: '21px',
                }}
              >
                ondemand_video
              </span>
              &nbsp; Reviews
            </Button>
          </div>
          <div className='p-2'>
            <Button
              size='sm'
              variant='secondary'
              style={{ paddingTop: '0px', width: '100%' }}
              onClick={settingsHandler}
            >
              <span
                className='material-icons-round'
                style={{
                  position: 'relative',
                  top: '5px',
                  fontSize: '21px',
                }}
              >
                settings
              </span>
              &nbsp; Settings
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSideBar;
