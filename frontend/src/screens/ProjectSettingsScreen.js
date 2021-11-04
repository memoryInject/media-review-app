import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Container,
  Button,
  Spinner,
  ButtonGroup,
  ToggleButton,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import ModalDialog from '../components/ModalDialog';

import { showToast, messageToast, variantToast } from '../actions/toastActions';
import { listProjectDetails, deleteProject } from '../actions/projectActions';
import ProjectReviewListTable from '../components/ProjectReviewListTable';
import ProjectDetailsListGroup from '../components/ProjectDetailsListGroup';
import ProjectEditModal from '../components/ProjectEditModal';
import { PROJECT_DELETE_RESET } from '../constants/projectConstants';

const ProjectSettingsScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const projectDetails = useSelector((state) => state.projectDetails);
  const { loading, error, project } = projectDetails;

  const projectDelete = useSelector((state) => state.projectDelete);
  const {
    loading: projectDeleteLoading,
    error: projectDeleteError,
    success,
  } = projectDelete;

  const [showProjectEditModal, setShowProjectEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [radioValue, setRadioValue] = useState('1');

  const radios = [
    { name: 'Details', value: '1' },
    { name: 'Review List', value: '2' },
  ];

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listProjectDetails(match.params.id));
    }
  }, [history, match.params.id, userInfo, dispatch]);

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

  const confirmDeleteHandler = () => {
    dispatch(deleteProject(match.params.id));
  };

  return (
    <div>
      <Row xs='auto'>
        <Col>
          <h5>
            <span
              style={{ position: 'relative', top: '5px' }}
              className='material-icons-round'
            >
              construction
            </span>
            &nbsp;
            <strong>Project Settings</strong>
          </h5>
        </Col>
      </Row>
      <Row
        xs='auto'
        style={{ paddingBottom: '1rem', paddingTop: '1rem' }}
        className='dflex justify-content-center'
      >
        <Col>
          <ButtonGroup>
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type='radio'
                variant='outline-success'
                name='radio'
                value={radio.value}
                checked={radioValue === radio.value}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Col>
      </Row>
      {error && <Message>{error}</Message>}
      {loading ? (
        <Loader />
      ) : (
        project && (
          <>
            <Container>
              <Row className='dflex justify-content-center'>
                {radioValue === '1' && (
                  <Col
                    xs={12}
                    md={12}
                    lg={6}
                    className='bg-dark py-2'
                    style={{ borderRadius: '0.25rem' }}
                  >
                    <h4 className='text-light text-center'>
                      <span
                        className='material-icons-round noselect'
                        style={{ position: 'relative', top: '3px' }}
                      >
                        settings
                      </span>
                      &nbsp;
                      {project && project.projectName}
                    </h4>
                    <ProjectDetailsListGroup project={project} />

                    {projectDeleteError && (
                      <Message>{projectDeleteError}</Message>
                    )}
                    {projectDeleteLoading ? (
                      <div className='d-flex justify-content-center'>
                        <Spinner
                          animation='border'
                          style={{
                            transition: 'all 0.5s ease-in-out',
                          }}
                        />
                      </div>
                    ) : (
                      project.user.id === user.id && (
                        <div className='text-end py-3'>
                          <Button
                            onClick={() => setShowModal(true)}
                            variant='danger'
                          >
                            Delete
                          </Button>
                          &nbsp; &nbsp;
                          <Button onClick={() => setShowProjectEditModal(true)}>
                            Edit
                          </Button>
                        </div>
                      )
                    )}
                  </Col>
                )}
              </Row>
              <Row className='dflex justify-content-center'>
                {radioValue === '2' && (
                  <Col
                    xs='auto'
                    className='bg-dark py-2'
                    style={{ borderRadius: '0.25rem' }}
                  >
                    {/*Table to show review list of this project*/}
                    <ProjectReviewListTable
                      history={history}
                      match={match}
                      project={project}
                      userDetails={userDetails}
                    />
                  </Col>
                )}
              </Row>
            </Container>

            {/*Modal Form to edit the project*/}
            <ProjectEditModal
              onHide={() => setShowProjectEditModal(false)}
              show={showProjectEditModal}
              history={history}
              match={match}
              project={project}
              user={user}
            />

            {/*Confirm dialog for project delete*/}
            <ModalDialog
              title='Delete Project'
              content={'This will delete the project forever!'}
              state={showModal}
              stateCallback={setShowModal}
              callback={confirmDeleteHandler}
            />
          </>
        )
      )}
    </div>
  );
};

export default ProjectSettingsScreen;
