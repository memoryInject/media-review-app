import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from '../components/Message';
import ModalDialog from '../components/ModalDialog';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import {
  listProjectDetails,
  updateProject,
  uploadImageProject,
  deleteProject,
} from '../actions/projectActions';
import {
  PROJECT_DELETE_RESET,
  PROJECT_UPDATE_RESET,
  PROJECT_UPLOAD_IMAGE_RESET,
} from '../constants/projectConstants';

const ProjectUpdateDeleteForm = ({ history, match, project, userDetails }) => {
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

  const projectDelete = useSelector((state) => state.projectDelete);
  const {
    loading: projectDeleteLoading,
    error: projectDeleteError,
    success,
  } = projectDelete;

  const formFile = useRef(null);
  const formRef = useRef(null);

  const [validated, setValidated] = useState(false);
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.projectName);
    }
  }, [project]);

  // This run after successfully uploaded the image
  useEffect(() => {
    if (image) {
      dispatch(
        updateProject(match.params.id, {
          projectName: name,
          imageUrl: image.url,
        })
      );
      dispatch({ type: PROJECT_UPLOAD_IMAGE_RESET });
    }
  }, [image, dispatch, name, match.params.id]);

  // This run after successfully Updated the project
  useEffect(() => {
    if (projectUpdateProject) {
      setName('');
      dispatch(messageToast('Project updated successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch(listProjectDetails(match.params.id));
      dispatch({ type: PROJECT_UPDATE_RESET });
    }
  }, [projectUpdateProject, dispatch, match.params.id]);

  // This run after successfully delete the project
  useEffect(() => {
    if (success) {
      dispatch(messageToast('Project deleted successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch({ type: PROJECT_DELETE_RESET });
      history.push('/');
    }
  }, [success, dispatch, history]);

  const submitHandler = () => {
    const form = formRef.current;

    if (form.checkValidity() === true) {
      if (formFile.current.files[0]) {
        dispatch(uploadImageProject(formFile.current.files[0]));
      } else {
        dispatch(updateProject(match.params.id, { projectName: name }));
      }
    }

    setValidated(true);
  };

  const confirmDeleteHandler = () => {
    dispatch(deleteProject(match.params.id));
  };

  return (
    <>
      <h4 className='text-light'>
        <span
          className='material-icons-round noselect'
          style={{ position: 'relative', top: '3px' }}
        >
          settings
        </span>
        &nbsp;
        {project && project.projectName}
      </h4>
      <h6 className='text-muted'>Creator: {project.user.username}</h6>
      {projectUpdateError && <Message>{projectUpdateError}</Message>}
      {projectUploadImageError && <Message>{projectUploadImageError}</Message>}
      {projectDeleteError && <Message>{projectDeleteError}</Message>}
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
              project.user.id !== userDetails.user.id
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
              project.user.id !== userDetails.user.id
                ? true
                : false
            }
          />
        </Form.Group>
        {projectUpdateLoading ||
        projectUploadImageLoading ||
        projectDeleteLoading ? (
          <div className='d-flex justify-content-center'>
            <Spinner
              animation='border'
              style={{
                transition: 'all 0.5s ease-in-out',
              }}
            />
          </div>
        ) : (
          project.user.id === userDetails.user.id && (
            <div className='text-end'>
              <Button onClick={() => setShowModal(true)} variant='danger'>
                Delete
              </Button>
              &nbsp; &nbsp;
              <Button onClick={submitHandler}>Update</Button>
            </div>
          )
        )}
      </Form>

      {/*Confirm dialog for project delete*/}
      <ModalDialog
        title='Delete Project'
        content={'This will delete the project forever!'}
        state={showModal}
        stateCallback={setShowModal}
        callback={confirmDeleteHandler}
      />
    </>
  );
};

export default ProjectUpdateDeleteForm;
