import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
  Form,
  FormControl,
  Button,
  ButtonGroup,
  ToggleButton,
} from 'react-bootstrap';

import Review from '../components/Review';
import ProjectSideBar from '../components/ProjectSideBar';
import ProjectTopBar from '../components/ProjectTopBar';
import ProjectCreateReviewModal from '../components/ProjectCreateReviewModal';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate, { pageSize } from '../components/Paginate';

import { listProjectDetails } from '../actions/projectActions';
import { listReview, listReviewPagination } from '../actions/reviewActions';
import { PROJECT_DETAILS_RESET } from '../constants/projectConstants';
import { REVIEW_LIST_RESET } from '../constants/reviewConstants';
import {
  reviewSearch,
  reviewSearchFilterCollaborated,
  reviewSearchFilterCreated,
  reviewSearchFilterShow,
} from '../actions/searchActions';

const ProjectScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const projectDetails = useSelector((state) => state.projectDetails);
  const { loading, error, project } = projectDetails;

  const reviewList = useSelector((state) => state.reviewList);
  const { loading: loadingReviews, error: errorReviews, reviews } = reviewList;

  const searchReview = useSelector((state) => state.searchReview);
  const { keyword } = searchReview;

  const searchFilterReview = useSelector((state) => state.searchFilterReview);
  const { show, created, collaborated } = searchFilterReview;

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listProjectDetails(match.params.id));
      dispatch(listReview(match.params.id, keyword));
    }
  }, [
    history,
    match.params.id,
    userInfo,
    dispatch,
    keyword,
    created,
    collaborated,
  ]);

  // This help to cleanup and better UX
  useEffect(() => {
    if (project && project.id.toString() !== match.params.id.toString()) {
      dispatch({ type: PROJECT_DETAILS_RESET });
      dispatch({ type: REVIEW_LIST_RESET });
    }
  }, [match, project, dispatch]);

  const settingsHandler = () => {
    history.push(history.location.pathname + '/settings');
  };

  const searchHandler = (e) => {
    e.preventDefault();
    dispatch(listReview(match.params.id, keyword));
  };

  const getMaxHeight = () => {
    let maxHeight = '85.75vh';
    if (pageSize < reviews.count) {
      maxHeight = '80vh';
    }

    if (show) {
      maxHeight = maxHeight === '80vh' ? '76vh' : '82vh';
    }

    return maxHeight;
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
                      value={keyword}
                      onChange={(e) => dispatch(reviewSearch(e.target.value))}
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
                            dispatch(reviewSearchFilterShow(e.target.checked))
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
                            dispatch(
                              reviewSearchFilterCreated(e.target.checked)
                            )
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
                              reviewSearchFilterCollaborated(e.target.checked)
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
          {errorReviews && <Message>{errorReviews}</Message>}
          {(loading && !project) ||
          (!loading && !project) ||
          (loadingReviews && !reviews) ||
          (!loadingReviews && !reviews) ||
          project.id.toString() !== match.params.id.toString() ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            reviews && (
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
                  {reviews.results.map((review) => (
                    <Col key={review.id.toString()}>
                      <Review projectId={match.params.id} review={review} />
                    </Col>
                  ))}
                </Row>
              </div>
            )
          )}
          <Row>
            <Col
              className='d-flex justify-content-center'
              style={{ position: 'relative', top: '10px' }}
            >
              {reviews && (
                <Paginate data={reviews} action={listReviewPagination} />
              )}
            </Col>
          </Row>
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
