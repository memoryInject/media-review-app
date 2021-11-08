import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Form, FormControl, Button } from 'react-bootstrap';

import Review from '../components/Review';
import ProjectSideBar from '../components/ProjectSideBar';
import ProjectTopBar from '../components/ProjectTopBar';
import ProjectCreateReviewModal from '../components/ProjectCreateReviewModal';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProjectDetails } from '../actions/projectActions';

const ProjectScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const projectDetails = useSelector((state) => state.projectDetails);
  const { loading, error, project } = projectDetails;

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listProjectDetails(match.params.id));
    }
  }, [history, match.params.id, userInfo, dispatch]);

  const settingsHandler = () => {
    history.push(history.location.pathname + '/settings');
  };

  const searchHandler = (e) => {
    e.preventDefault();
    dispatch(listProjectDetails(match.params.id, search));
  };

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
          style={{ width: '17.5rem', transition: 'all 0.5s ease-in-out' }}
          className='d-none d-md-none d-lg-block'
        >
          <ProjectSideBar
            id={match.params.id}
            settingsHandler={settingsHandler}
          />
        </Col>
        <Col style={{ position: 'relative' }}>
          <Row>
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
                  <Form className='d-flex' onSubmit={searchHandler}>
                    <FormControl
                      type='search'
                      placeholder='Search'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className='me-2 text-white'
                      aria-label='Search'
                      style={{
                        backgroundColor: '#3A3A3A',
                        border: '0px',
                      }}
                    />
                    <Button variant='outline-success' type='submit'>
                      Search
                    </Button>
                  </Form>
                </Col>
                <Col className='text-end  d-none d-md-block' md>
                  {user && user.profile.isAdmin && (
                    <Button
                      style={{
                        paddingTop: '0.35rem',
                        paddingBottom: '0.35rem',
                      }}
                      onClick={() => setShowModal(true)}
                    >
                      <span
                        className='p-0 material-icons-round'
                        style={{
                          position: 'relative',
                          top: '3px',
                          fontSize: '20px',
                        }}
                      >
                        add
                      </span>
                      CREATE REVIEW
                    </Button>
                  )}
                </Col>
                <Col className='d-block d-sm-block d-md-none' md>
                  {user && user.profile.isAdmin && (
                    <Button
                      onClick={() => setShowModal(true)}
                      style={{
                        paddingTop: '0.35rem',
                        paddingBottom: '0.35rem',
                        marginBottom: '0.4rem',
                        width: '100%',
                      }}
                    >
                      <span
                        className='p-0 material-icons-round'
                        style={{
                          position: 'relative',
                          top: '3px',
                          fontSize: '20px',
                        }}
                      >
                        add
                      </span>
                      CREATE REVIEW
                    </Button>
                  )}
                </Col>
              </Row>
              {project && (
                <div className='d-md-block d-lg-none py-2'>
                  <ProjectTopBar settingsHandler={settingsHandler} />
                </div>
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
            <Row xs='auto'>
              {error && <Message>{error}</Message>}
              {(loading && !project) ||
              (!loading && !project) ||
              project.id.toString() !== match.params.id.toString() ? (
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
          </div>
        </Col>
      </Row>

      {/*Dialog for create new review*/}
      <ProjectCreateReviewModal
        show={showModal}
        onHide={() => setShowModal(false)}
        id={match.params.id}
      />
    </div>
  );
};

export default ProjectScreen;
