import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
  Card,
  Image,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Review from '../components/Review';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProjectDetails } from '../actions/projectActions';

const ProjectScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const projectDetails = useSelector((state) => state.projectDetails);
  const { loading, error, project } = projectDetails;

  useEffect(() => {
    dispatch(listProjectDetails(match.params.id));
  }, [match.params.id, dispatch]);

  return (
    <div
      style={{
        transition: 'all 0.5s ease-in-out',
      }}
    >
      <Row
        style={{
          transition: 'all 0.5s ease-in-out',
        }}
      >
        <Col
          sm='auto'
          style={{ width: '17.5rem',
          transition: 'all 0.5s ease-in-out',
          }}
          className='d-none d-md-none d-lg-block'
        >
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
            {loading ? (
              <div className='d-flex justify-content-center py-4'>
                <Loader />
              </div>
            ) : (
              <>
              <Image src={project.imageUrl} className='project-bar-img' />
            <div className='project-bar-gradient'></div>
            <h5 className='px-2' style={{ position: 'relative', top: '-25px' }}>
              {project.projectName}
            </h5>
            <div className='text-end p-0 m-0' style={{position: 'relative'}}>
                <span
                  className='material-icons-round text-primary'
                  style={{ position: 'relative',top: '-20px',  left: '-6px', fontSize: '34px' }}
                >
                  circle
                </span>
              {/*<span className='text-light'*/}
                  {/*style={{ position: 'absolute',top: '-17px',  left: '228px', fontSize: '18px' }}*/}
              {/*>{project.reviews && project.reviews.length}</span>*/}
            </div>
            <div className='px-2'>
              <Button
                size='sm'
                variant='primary'
                style={{ paddingTop: '0px', width: '100%' }}
              >
                <span
                  className='material-icons-round'
                  style={{ position: 'relative', top: '5px', fontSize: '21px' }}
                >
                  ondemand_video
                </span>
                &nbsp; Reviews
              </Button>
            </div>
            <div className='p-2'>
              <Button
                size='sm'
                variant='light'
                style={{ paddingTop: '0px', width: '100%' }}
              >
                <span
                  className='material-icons-round'
                  style={{ position: 'relative', top: '5px', fontSize: '21px' }}
                >
                  settings
                </span>
                &nbsp; Settings
              </Button>
            </div>
              </>
            )}
            {/*<div*/}
              {/*className='p-2 m-2 text-muted'*/}
              {/*style={{ border: '1px solid #444444', borderRadius: '0.25rem' }}*/}
            {/*>*/}
              {/*<span>Creator &nbsp;: {project.user && project.user.username}</span>*/}
              {/*<p>Reviews : {project.reviews && project.reviews.length}</p>*/}
            {/*</div>*/}
            {/*<h6 className='px-2'>*/}
            {/*{' '}*/}
            {/*<span*/}
            {/*className='material-icons-round text-primary'*/}
            {/*style={{ position: 'relative', top: '4px', fontSize: '21px' }}*/}
            {/*>*/}
            {/*ondemand_video*/}
            {/*</span>*/}
            {/*&nbsp; &nbsp; Reviews*/}
            {/*</h6>*/}
            {/*<h6 className='p-2'>*/}
            {/*{' '}*/}
            {/*<span*/}
            {/*className='material-icons-round text-light'*/}
            {/*style={{ position: 'relative', top: '4px', fontSize: '21px' }}*/}
            {/*>*/}
            {/*settings*/}
            {/*</span>*/}
            {/*&nbsp; &nbsp; Settings*/}
            {/*</h6>*/}
            {/*<h6 className='px-2'>*/}
            {/*{' '}*/}
            {/*<span*/}
            {/*className='material-icons-round text-info'*/}
            {/*style={{ position: 'relative', top: '4px', fontSize: '21px' }}*/}
            {/*>*/}
            {/*add*/}
            {/*</span>*/}
            {/*&nbsp; &nbsp; Create review*/}
            {/*</h6>*/}
          </div>
        </Col>
        <Col>
          <Row>
            <Col md>
              <h4>
                <span
                  className='material-icons-round'
                  style={{ transform: 'translate(0, 4px)' }}
                >
                  ondemand_video
                </span>
                &nbsp; Reviews
              </h4>
            </Col>
            <Col md style={{ marginBottom: '12px' }}>
              <Form className='d-flex'>
                <FormControl
                  type='search'
                  placeholder='Search'
                  className='me-2 text-white'
                  aria-label='Search'
                  style={{
                    backgroundColor: '#3A3A3A',
                    border: '0px',
                  }}
                />
                <Button variant='outline-success'>Search</Button>
              </Form>
            </Col>
            <Col className='text-end' md>
              <Button
                style={{ paddingTop: '0.35rem', paddingBottom: '0.35rem' }}
              >
                <span
                  className='p-0 material-icons-round'
                  style={{ position: 'relative', top: '3px', fontSize: '20px' }}
                >
                  add
                </span>
                CREATE REVIEW
              </Button>
            </Col>
          </Row>
          <Row className='d-md-block d-lg-none'>
            <Col md>
              <h4>{project.projectName}</h4>
            </Col>
            <Col md>
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
            </Col>
          </Row>
          <Row sm='auto'></Row>
          <Row xs='auto'>
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              project.reviews &&
              project.reviews.map((review) => (
                <Col key={review.id.toString()}>
                  <Review projectId={match.params.id} review={review} />
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectScreen;
//<Col>
//<div
//className='bg-dark'
//style={{
//height: '80vh',
//borderRadius: '0.25rem',
//position: 'relative',
//}}
//>
//<Image src={project.imageUrl} className='project-bar-img' />
//<div className='project-bar-gradient'></div>
//<h5 className='px-2' style={{ position: 'relative', top: '-25px' }}>
//{project.projectName}
//</h5>
//<h6 className='px-2'>
//{' '}
//<span
//className='material-icons-round text-primary'
//style={{ position: 'relative', top: '4px', fontSize: '21px' }}
//>
//ondemand_video
//</span>
//&nbsp;
//&nbsp;
//Reviews
//</h6>
//<h6 className='p-2'>
//{' '}
//<span
//className='material-icons-round text-light'
//style={{ position: 'relative', top: '4px', fontSize: '21px' }}
//>
//settings
//</span>
//&nbsp;
//&nbsp;
//Settings
//</h6>
//</div>
//</Col>
//

//<Col md>
//<div
//style={{
//display: 'block',
////height: `${loading ? '0px' : '50px'}`,
//transition: 'all 0.5s ease-in-out',
//opacity: `${loading ? '0' : '1'}`,
//}}
//>
//<h4 style={{marginBottom: '0px'}}>{project.projectName}</h4>
//<Link
//to={`/projects/${project.id}`}
//style={{ textDecoration: 'none' }}
//>
//<span
//className='p-0 material-icons-round'
//style={{ position: 'relative', top: '4px', fontSize: '20px' }}
//>
//settings
//</span>
//&nbsp; &nbsp;
//<span>Settings</span>
//</Link>
//</div>
//</Col>
