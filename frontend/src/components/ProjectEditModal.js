import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Spinner, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../components/Message';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import {
  listProjectDetails,
  updateProject,
  uploadImageProject,
} from '../actions/projectActions';
import {
  PROJECT_UPDATE_RESET,
  PROJECT_UPLOAD_IMAGE_RESET,
} from '../constants/projectConstants';

const ProjectEditModal = (props) => {
  const dispatch = useDispatch();

  const projectUpdate = useSelector((state) => state.projectUpdate);
  const {
    loading: projectUpdateLoading,
    error: projectUpdateError,
    project: projectUpdateProject,
  } = projectUpdate;

  const projectUploadImage = useSelector((state) => state.projectUploadImage);
  const {
    loading: projectUploadImageLoading,
    error: projectUploadImageError,
    image,
  } = projectUploadImage;

  const formFile = useRef(null);
  const formRef = useRef(null);

  const [validated, setValidated] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (props.project) {
      setName(props.project.projectName);
    }
  }, [props.project]);

  // This run after successfully uploaded the image
  useEffect(() => {
    if (image) {
      dispatch(
        updateProject(props.match.params.id, {
          projectName: name,
          imageUrl: image.url,
        })
      );
      dispatch({ type: PROJECT_UPLOAD_IMAGE_RESET });
    }
  }, [image, dispatch, name, props.match.params.id]);

  // This run after successfully Updated the project
  useEffect(() => {
    if (projectUpdateProject) {
      setName('');
      dispatch(messageToast('Project updated successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch(listProjectDetails(props.match.params.id));
      dispatch({ type: PROJECT_UPDATE_RESET });
      props.onHide();
    }
  }, [projectUpdateProject, dispatch, props]);

  const submitHandler = () => {
    const form = formRef.current;

    if (form.checkValidity() === true) {
      if (formFile.current.files[0]) {
        dispatch(uploadImageProject(formFile.current.files[0]));
      } else {
        dispatch(updateProject(props.match.params.id, { projectName: name }));
      }
    }

    setValidated(true);
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
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
            &nbsp; Edit project
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
                  projectUpdateLoading ||
                  projectUploadImageLoading ||
                  props.project.user.id !== props.user.id
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
                Project image
                <span className='text-muted'> (optional)</span>
              </Form.Label>
              <Form.Control
                type='file'
                ref={formFile}
                disabled={
                  projectUpdateLoading ||
                  projectUploadImageLoading ||
                  props.project.user.id !== props.user.id
                    ? true
                    : false
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        {projectUpdateLoading || projectUploadImageLoading ? (
          <div className='d-flex justify-content-center'>
            <Spinner
              animation='border'
              style={{
                transition: 'all 0.5s ease-in-out',
              }}
            />
          </div>
        ) : projectUpdateProject ? (
          <div style={{ minHeight: '30px' }}></div>
        ) : (
          <>
            {projectUpdateError && <Message>{projectUpdateError}</Message>}
            {projectUploadImageError && (
              <Message>{projectUploadImageError}</Message>
            )}
            <Modal.Footer>
              <Button onClick={props.onHide} variant='danger'>
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

export default ProjectEditModal;
