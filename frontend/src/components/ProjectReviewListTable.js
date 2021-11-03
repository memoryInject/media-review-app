import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from './Message';
import Loader from './Loader';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import ModalDialog from './ModalDialog';

import { listProjectDetails } from '../actions/projectActions';
import { deleteReview } from '../actions/reviewActions';
import { REVIEW_DELETE_RESET } from '../constants/reviewConstants';

const ProjectReviewListTable = ({ history, match, project, userDetails }) => {
  const dispatch = useDispatch();

  const reviewDelete = useSelector((state) => state.reviewDelete);
  const { loading, success, error } = reviewDelete;

  const [showModal, setShowModal] = useState(false);
  const [reviewId, setReviewId] = useState(0);

  // This will run after successfully delete the media
  useEffect(() => {
    if (success) {
      dispatch({ type: REVIEW_DELETE_RESET });
      dispatch(listProjectDetails(match.params.id));
      dispatch(messageToast('Media deleted successfully'));
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
            {project &&
              project.reviews.map((review, idx) => (
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
