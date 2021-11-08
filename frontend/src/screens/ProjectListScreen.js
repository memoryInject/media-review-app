import React, { useState, useEffect, useRef } from 'react';
import {
  Col,
  Row,
  Button,
  Form,
  FormControl,
  Modal,
  Spinner,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Project from '../components/Project';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import {
  listProjects,
  createProject,
  uploadImageProject,
} from '../actions/projectActions';
import {
  PROJECT_CREATE_RESET,
  PROJECT_UPLOAD_IMAGE_RESET,
} from '../constants/projectConstants';

const ProjectListScreen = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const projectList = useSelector((state) => state.projectList);
  const { loading, error, projects } = projectList;

  const projectCreate = useSelector((state) => state.projectCreate);
  const {
    loading: projectCreateLoading,
    error: projectCreateError,
    project: projectCreateProject,
  } = projectCreate;

  const projectUploadImage = useSelector((state) => state.projectUploadImage);
  const {
    loading: projectUploadImageLoading,
    error: projectUploadImageError,
    image,
  } = projectUploadImage;

  const formFile = useRef(null);
  const formRef = useRef(null);

  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(true);
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listProjects());
    }
  }, [history, userInfo, dispatch]);

  // This run when the modal form opens
  useEffect(() => {
    if (showModal) {
      dispatch({ type: PROJECT_CREATE_RESET });
      dispatch({ type: PROJECT_UPLOAD_IMAGE_RESET });
      setSuccess(false);
      setValidated(false);
      setName('');
    }
  }, [showModal, dispatch]);

  // This run after successfully uploaded the image
  useEffect(() => {
    if (image) {
      dispatch(createProject({ projectName: name, imageUrl: image.url }));
      dispatch({ type: PROJECT_UPLOAD_IMAGE_RESET });
    }
  }, [image, dispatch, name]);

  // This run after successfully created the project
  useEffect(() => {
    if (projectCreateProject) {
      setShowModal(false);
      setSuccess(true);
      setName('');
      dispatch(messageToast('Project created successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch(listProjects());
      dispatch({ type: PROJECT_CREATE_RESET });
    }
  }, [projectCreateProject, dispatch]);

  const submitHandler = () => {
    const form = formRef.current;

    if (form.checkValidity() === true) {
      if (formFile.current.files[0]) {
        dispatch(uploadImageProject(formFile.current.files[0]));
      } else {
        dispatch(createProject({ projectName: name }));
      }
    }

    setValidated(true);
  };

  const searchHandler = (e) => {
    e.preventDefault()
    dispatch(listProjects(search))
  }

  return (
    <>
      <Row>
        <Col md>
          <h4>
            <span
              className='material-icons-round'
              style={{ transform: 'translate(0, 2px)' }}
            >
              library_books
            </span>
            &nbsp; Projects
          </h4>
        </Col>
        <Col md style={{ marginBottom: '12px' }}>
          <Form className='d-flex' onSubmit={searchHandler}>
            <FormControl
              type='search'
              placeholder='Search'
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className='me-2 text-white'
              aria-label='Search'
              style={{
                backgroundColor: '#3A3A3A',
                border: '0px',
              }}
            />
            <Button variant='outline-success' type='submit'>Search</Button>
          </Form>
        </Col>
        <Col className='text-end d-none d-md-block' md>
          {user && user.profile.isAdmin && (
            <Button
              style={{ paddingTop: '0.35rem', paddingBottom: '0.35rem' }}
              onClick={() => setShowModal(true)}
            >
              <span
                className='p-0 material-icons-round'
                style={{ position: 'relative', top: '3px', fontSize: '20px' }}
              >
                add
              </span>
              CREATE PROJECT
            </Button>
          )}
        </Col>
        <Col className='d-block d-sm-block d-md-none' md style={{paddingBottom: '1rem'}}>
          {user && user.profile.isAdmin && (
            <Button
              style={{
                paddingTop: '0.35rem',
                paddingBottom: '0.35rem',
                width: '100%',
              }}
              onClick={() => setShowModal(true)}
            >
              <span
                className='p-0 material-icons-round'
                style={{ position: 'relative', top: '3px', fontSize: '20px' }}
              >
                add
              </span>
              CREATE PROJECT
            </Button>
          )}
        </Col>
      </Row>
          <div
            id='style-2'
            style={{
              maxHeight: '85.75vh',
              overflow: 'auto',
              position: 'relative',
              transition: 'all 0.5s ease-in-out',
            }}
          >
      {error && <Message>{error}</Message>}
      {(loading && !projects) || (!loading && !projects) ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row xs='auto'>
          {projects.map((project) => (
            <Col key={project.id.toString()}>
              <Project project={project} />
            </Col>
          ))}
        </Row>
      )}
          </div>

      {/*Dialog for create project*/}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            <span
              className='material-icons-round'
              style={{ transform: 'translate(0, 4px)' }}
            >
              movie
            </span>
            &nbsp; Create project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
          >
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter project name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={
                  projectCreateLoading || projectUploadImageLoading
                    ? true
                    : false
                }
                required
              />
              <Form.Control.Feedback type='invalid'>
                Please provide a valid name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='formFile' className='mb-3'>
              <Form.Label>
                Project image<span className='text-muted'> (optional)</span>
              </Form.Label>
              <Form.Control
                type='file'
                ref={formFile}
                disabled={
                  projectCreateLoading || projectUploadImageLoading
                    ? true
                    : false
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        {projectCreateLoading || projectUploadImageLoading ? (
          <div className='d-flex justify-content-center'>
            <Spinner
              animation='border'
              style={{
                transition: 'all 0.5s ease-in-out',
              }}
            />
          </div>
        ) : success ? (
          <div style={{ minHeight: '30px' }}></div>
        ) : (
          <>
            {projectCreateError && <Message>{projectCreateError}</Message>}
            {projectUploadImageError && (
              <Message>{projectUploadImageError}</Message>
            )}
            <Modal.Footer>
              <Button onClick={() => setShowModal(false)} variant='danger'>
                Close
              </Button>
              <Button variant='primary' onClick={submitHandler}>
                Submit
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default ProjectListScreen;
