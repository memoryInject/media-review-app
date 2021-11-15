import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import Message from './Message';
import Loader from './Loader';
import { showToast, messageToast, variantToast } from '../actions/toastActions';
import ModalDialog from './ModalDialog';
import ReviewUpdateMediaModal from './ReviewUpdateMediaModal';

import { deleteMedia, listMedia } from '../actions/mediaActions';
import { listReviewDetails } from '../actions/reviewActions';
import { MEDIA_DELETE_RESET } from '../constants/mediaConstants';

const ReviewMediaListTable = ({ history, match, review, userDetails }) => {
  const dispatch = useDispatch();

  const mediaDelete = useSelector((state) => state.mediaDelete);
  const { loading, success, error } = mediaDelete;

  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [mediaId, setMediaId] = useState(0);

  // This will run after successfully delete the media
  useEffect(() => {
    if (success) {
      dispatch({ type: MEDIA_DELETE_RESET });
      dispatch(listReviewDetails(match.params.reviewId));
      dispatch(listMedia(match.params.reviewId))
      dispatch(messageToast('Media deleted successfully'));
      dispatch(variantToast('success'));
      dispatch(showToast(true));
    }
  }, [success, dispatch, match]);

  const settingsMediaHandler = (id) => {
    setShowModal(true);
    setMediaId(id);
  };

  const deleteMediaHandler = (id) => {
    setShowDeleteConfirmModal(true);
    setMediaId(id);
  };

  const confirmDeleteHandler = () => {
    dispatch(deleteMedia(mediaId));
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
        Media list
      </h6>
      <div className='table-responsive'>
        <Table striped bordered hover className='align-middle'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Media Name</th>
              <th>Version</th>
              <th>ParentId</th>
              <th>Creator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {review &&
              review.media.map((media, idx) => (
                <tr key={idx}>
                  <td>{media.id}</td>
                  <td>{media.mediaName}</td>
                  <td>{media.version}</td>
                  <td>{media.parent}</td>
                  <td>{media.user.username}</td>
                  <td>
                    {userDetails.user.id === media.user.id && (
                      <>
                        <span
                          onClick={() => settingsMediaHandler(media.id)}
                          className='material-icons-round text-info noselect px-1'
                          style={buttonStyle}
                        >
                          edit
                        </span>
                        <span
                          onClick={() => deleteMediaHandler(media.id)}
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
      <ReviewUpdateMediaModal
        show={showModal}
        onHide={() => setShowModal(false)}
        id={mediaId}
        history={history}
        match={match}
      />

      {/*Confirm dialog for media delete*/}
      <ModalDialog
        title='Delete Media'
        content={'This will delete the media forever!'}
        state={showDeleteConfirmModal}
        stateCallback={setShowDeleteConfirmModal}
        callback={confirmDeleteHandler}
      />
    </>
  );
};

export default ReviewMediaListTable;
