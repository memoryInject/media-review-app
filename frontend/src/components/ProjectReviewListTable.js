import React, { useState, useEffect } from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from './Message';
import Loader from './Loader';
import ModalDialog from './ModalDialog';
import Paginate from './Paginate';

import { showToast, messageToast, variantToast } from '../actions/toastActions';
import { listProjectDetails } from '../actions/projectActions';
import {
  deleteReview,
  listReview,
  listReviewPagination,
} from '../actions/reviewActions';
import { REVIEW_DELETE_RESET } from '../constants/reviewConstants';

const ProjectReviewListTable = ({ history, match, project, userDetails }) => {
  const dispatch = useDispatch();

  const reviewDelete = useSelector((state) => state.reviewDelete);
  const { loading, success, error } = reviewDelete;

  const reviewList = useSelector((state) => state.reviewList);
  const { loading: loadingReviews, error: errorReviews, reviews } = reviewList;

  const [showModal, setShowModal] = useState(false);
  const [reviewId, setReviewId] = useState(0);

  useEffect(() => {
    if (!reviews) {
      dispatch(listReview(match.params.id));
    }

    if (project.id.toString() !== match.params.id.toString()) {
      dispatch(listProjectDetails(match.params.id));
      dispatch(listReview(match.params.id));
    }

    if (
      reviews &&
      reviews.results.length &&
      reviews.results[0].project.id.toString() !== project.id.toString()
    ) {
      dispatch(listReview(match.params.id));
    }
  }, [match, project, dispatch, reviews]);

  // This will run after successfully delete the review
  useEffect(() => {
    if (success) {
      dispatch({ type: REVIEW_DELETE_RESET });
      dispatch(listReview(match.params.id));
      dispatch(messageToast('Review deleted successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
    }
  }, [success, dispatch, match]);

  const openReviewHandler = (id) => {
    history.push(`/projects/${match.params.id}/reviews/${id}`);
  };

  const settingsReviewHandler = (id) => {
    history.push(`/projects/${match.params.id}/reviews/${id}/settings`);
  };

  const deleteReviewHandler = (id) => {
    setShowModal(true);
    setReviewId(id);
  };

  const confirmDeleteHandler = () => {
    dispatch(deleteReview(reviewId));
  };

  const buttonStyle = {
    cursor: 'pointer',
  };

  return (
    <>
      {loading && <Loader />}
      {error && <Message>{error}</Message>}
      {loadingReviews ? (
        <Loader />
      ) : errorReviews ? (
        <Message>{errorReviews}</Message>
      ) : (
        <>
          <h6 className='text-light'>
            <span
              style={{ position: 'relative', top: '6px' }}
              className='material-icons-round'
            >
              view_list
            </span>
            Review list
          </h6>
          <div className='table-responsive'>
            <Table striped bordered hover className='align-middle'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Review Name</th>
                  <th>Creator</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews &&
                  reviews.results.map((review, idx) => (
                    <tr key={idx}>
                      <td>{review.id}</td>
                      <td>{review.reviewName}</td>
                      <td>{review.user.username}</td>
                      <td>
                        <span
                          onClick={() => openReviewHandler(review.id)}
                          className='material-icons-round text-info noselect'
                          style={buttonStyle}
                        >
                          launch
                        </span>
                        <span
                          onClick={() => settingsReviewHandler(review.id)}
                          className='material-icons-round text-light noselect px-1'
                          style={buttonStyle}
                        >
                          settings
                        </span>
                        {userDetails.user.id === review.user.id && (
                          <>
                            <span
                              onClick={() => deleteReviewHandler(review.id)}
                              className='material-icons-round text-danger noselect'
                              style={buttonStyle}
                            >
                              delete
                            </span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
          <Row>
            <Col className='d-flex justify-content-center'>
              {reviews && (
                <Paginate data={reviews} action={listReviewPagination} />
              )}
            </Col>
          </Row>
        </>
      )}

      {/*Confirm dialog for media delete*/}
      <ModalDialog
        title='Delete Review'
        content={'This will delete the review forever!'}
        state={showModal}
        stateCallback={setShowModal}
        callback={confirmDeleteHandler}
      />
    </>
  );
};

export default ProjectReviewListTable;
