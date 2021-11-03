import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import ProjectUpdateDeleteForm from '../components/ProjectUpdateDeleteForm';
import { listProjectDetails } from '../actions/projectActions';
import ProjectReviewListTable from '../components/ProjectReviewListTable';

const ProjectSettingsScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const projectDetails = useSelector((state) => state.projectDetails);
  const { loading, error, project } = projectDetails;

  const [showReviewList, setShowReviewList] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listProjectDetails(match.params.id));
    }
  }, [history, match.params.id, userInfo, dispatch]);

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
        style={{ cursor: 'pointer', paddingBottom: '1rem' }}
        className='dflex justify-content-center text-success'
      >
        <Col className='py-1'>
          {showReviewList ? (
            <span onClick={() => setShowReviewList(false)}>Details</span>
          ) : (
            <span>
              <strong>Details</strong>
            </span>
          )}
        </Col>
        <Col className='py-1'>
          {showReviewList ? (
            <span>
              <strong>Review list</strong>
            </span>
          ) : (
            <span
              onClick={() => setShowReviewList(true)}
            >
              Review list
            </span>
          )}
        </Col>
      </Row>
      {error && <Message>{error}</Message>}
      {loading ? (
        <Loader />
      ) : (
        project && (
          <>
            <Container >
              <Row className='dflex justify-content-center'>
                {!showReviewList && (
                  <Col
                    xs={12}
                    md={12}
                    lg={6}
                    className='bg-dark py-2'
                    style={{ borderRadius: '0.25rem' }}
                  >
                    {/*Form to update/delete the project*/}
                    <ProjectUpdateDeleteForm
                      history={history}
                      match={match}
                      project={project}
                      userDetails={userDetails}
                    />
                  </Col>
                )}
              </Row>
              <Row className='dflex justify-content-center'>
                {showReviewList && (
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
          </>
        )
      )}
    </div>
  );
};

export default ProjectSettingsScreen;
