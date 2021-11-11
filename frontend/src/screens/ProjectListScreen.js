import React, { useState, useEffect, useRef } from 'react';
import {
  Col,
  Row,
  Button,
  Form,
  FormControl,
  Modal,
  Spinner,
  ButtonGroup,
  ToggleButton,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Project from '../components/Project';
import Paginate, { pageSize } from '../components/Paginate';

import { showToast, messageToast, variantToast } from '../actions/toastActions';
import {
  listProjects,
  listProjectsPagination,
  createProject,
  uploadImageProject,
} from '../actions/projectActions';
import {
  PROJECT_CREATE_RESET,
  PROJECT_UPLOAD_IMAGE_RESET,
} from '../constants/projectConstants';
import {
  projectSearch,
  projectSearchFilterCollaborated,
  projectSearchFilterCreated,
  projectSearchFilterShow,
} from '../actions/searchActions';

const ProjectListScreen = ({ history }) => {
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

  const searchProject = useSelector((state) => state.searchProject);
  const { keyword } = searchProject;

  const searchFilterProject = useSelector((state) => state.searchFilterProject);
  const { show, created, collaborated } = searchFilterProject;

  const formFile = useRef(null);
  const formRef = useRef(null);

  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listProjects(keyword));
    }
  }, [history, userInfo, dispatch, keyword, created, collaborated]);

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
    e.preventDefault();
    dispatch(listProjects(keyword));
  };

  const getMaxHeight = () => {
    let maxHeight = '85.75vh';
    if (pageSize < projects.count) {
      maxHeight = '80vh';
    }

    if (show) {
      maxHeight = maxHeight === '80vh' ? '76vh' : '82vh';
    }

    return maxHeight;
  };

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
              value={keyword}
              onChange={(e) => dispatch(projectSearch(e.target.value))}
              className='me-2 text-white'
              aria-label='Search'
              style={{
                backgroundColor: '#3A3A3A',
                border: '0px',
              }}
            />
            {user && !user.profile.isAdmin && (
              <Button variant='outline-success' type='submit'>
                Search
              </Button>
            )}
            {user && user.profile.isAdmin && (
              <ButtonGroup aria-label='Basic example'>
                <Button variant='outline-success' type='submit'>
                  Search
                </Button>
                <ToggleButton
                  id='toggle-check'
                  type='checkbox'
                  variant='outline-success'
                  checked={show}
                  onChange={(e) =>
                    dispatch(projectSearchFilterShow(e.target.checked))
                  }
                >
                  <span
                    className='material-icons-round'
                    style={{
                      fontSize: '21px',
                      position: 'absolute',
                      top: '20%',
                      left: '8%',
                    }}
                  >
                    tune
                  </span>
                </ToggleButton>
              </ButtonGroup>
            )}
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
        <Col
          className='d-block d-sm-block d-md-none'
          md
          style={{ paddingBottom: '1rem' }}
        >
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
      {user && user.profile.isAdmin && (
        <Row
          className={`${show ? 'py-1' : ''}`}
          style={{
            borderRadius: '0.25rem',
            opacity: `${show ? '1' : '0'}`,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {show && (
            <Col>
              <Form>
                <Row xs='auto'>
                  <Col>
                    <Form.Check
                      type='switch'
                      id='custom-switch'
                      label='Created by me'
                      checked={created}
                      onChange={(e) =>
                        dispatch(projectSearchFilterCreated(e.target.checked))
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Check
                      type='switch'
                      label='Collaborated in'
                      id='disabled-custom-switch'
                      checked={collaborated}
                      onChange={(e) =>
                        dispatch(
                          projectSearchFilterCollaborated(e.target.checked)
                        )
                      }
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          )}
        </Row>
      )}

      {error && <Message>{error}</Message>}
      {(loading && !projects) || (!loading && !projects) ? (
        <Loader style={{ position: 'absolute' }} />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div
          id='style-2'
          style={{
            maxHeight: getMaxHeight(),
            overflow: 'auto',
            position: 'relative',
            transition: 'all 0.5s ease-in-out',
          }}
        >
          <Row xs='auto'>
            {projects.results.map((project) => (
              <Col key={project.id.toString()}>
                <Project project={project} />
              </Col>
            ))}
          </Row>
        </div>
      )}
      <Row>
        <Col
          className='d-flex justify-content-center'
          style={{ position: 'relative', top: '10px' }}
        >
          {projects && (
            <Paginate data={projects} action={listProjectsPagination} />
          )}
        </Col>
      </Row>

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
