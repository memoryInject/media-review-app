import React, { useState, useEffect } from 'react';
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
import Collaborators from '../components/Collaborators';
import ReviewMediaListTable from '../components/ReviewMediaListTable';
import ReviewDetailsListGroup from '../components/ReviewDetailsListGroup';
import ReviewEditModal from '../components/ReviewEditModal';

import { showUICollaborator } from '../actions/collaboratorActions';
import { listReviewDetails, deleteReview } from '../actions/reviewActions';
import { REVIEW_DELETE_RESET } from '../constants/reviewConstants';

const ReviewSettingsScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  let { loading, error, review } = reviewDetails;

  const reviewDelete = useSelector((state) => state.reviewDelete);
  const {
    loading: reviewDeleteLoading,
    error: reviewDeleteError,
    success,
  } = reviewDelete;

  const [showReviewEditModal, setShowReviewEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [radioValue, setRadioValue] = useState('1');

  const radios = [
    { name: 'Details', value: '1' },
    { name: 'Media List', value: '2' },
  ];

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      dispatch(listReviewDetails(match.params.reviewId));
    }
  }, [history, match, userInfo, dispatch]);

  // This run after successfully delete the review
  useEffect(() => {
    if (success) {
      dispatch(messageToast('Review deleted successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
      dispatch({ type: REVIEW_DELETE_RESET });
      history.push(`/projects/${match.params.id}`);
    }
  }, [success, dispatch, history, match]);

  const confirmDeleteHandler = () => {
    dispatch(deleteReview(match.params.reviewId));
  };

  return (
    <div>
      <Row style={{ marginBottom: '0.5rem' }}>
        <Col>
          <h5>
            <span
              style={{ position: 'relative', top: '5px' }}
              className='material-icons-round'
            >
              construction
            </span>
            &nbsp;
            <strong>Review Settings</strong>
          </h5>
        </Col>
        <Col xs='auto' className='text-end'>
          <Button
            style={{ paddingTop: '0px' }}
            variant='primary'
            onClick={() => dispatch(showUICollaborator())}
          >
            <span
              style={{
                transform: 'translate(0, 4px)',
              }}
              className='material-icons-round'
            >
              people
            </span>
            &nbsp;
            <span>Collaborators</span>
          </Button>
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
        review &&
        userDetails && (
          <>
            <Collaborators />
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
                      {review && review.reviewName}
                    </h4>
                    <ReviewDetailsListGroup review={review} />

                    {reviewDeleteError && (
                      <Message>{reviewDeleteError}</Message>
                    )}
                    {reviewDeleteLoading ? (
                      <div className='d-flex justify-content-center'>
                        <Spinner
                          animation='border'
                          style={{
                            transition: 'all 0.5s ease-in-out',
                          }}
                        />
                      </div>
                    ) : (
                      review.user.id === user.id && (
                        <div className='text-end py-3'>
                          <Button
                            onClick={() => setShowModal(true)}
                            variant='danger'
                          >
                            Delete
                          </Button>
                          &nbsp; &nbsp;
                          <Button onClick={() => setShowReviewEditModal(true)}>
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
                    <ReviewMediaListTable
                      history={history}
                      match={match}
                      review={review}
                      userDetails={userDetails}
                    />
                  </Col>
                )}
              </Row>
            </Container>

            {/*Modal Form to edit the review*/}
            <ReviewEditModal
              onHide={() => setShowReviewEditModal(false)}
              show={showReviewEditModal}
              match={match}
              review={review}
              userDetails={userDetails}
            />
            {/*Confirm dialog for review delete*/}
            <ModalDialog
              title='Delete review'
              content={'This will delete the review forever!'}
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

export default ReviewSettingsScreen;
