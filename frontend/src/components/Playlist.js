import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { listMediaDetails } from '../actions/mediaActions';
import { listFeedbacks } from '../actions/feedbackActions';
import { FEEDBACK_CREATE_RESET } from '../constants/feedbackConstants';
import { listPlaylistDetails } from '../actions/playlistActions';
import { PLAYLIST_DETAILS_RESET } from '../constants/playlistConstants';

const Playlist = () => {
  const dispatch = useDispatch();
  const mediaDetails = useSelector((state) => state.mediaDetails);
  const { media } = mediaDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const playlistDetails = useSelector((state) => state.playlistDetails);
  const { playlist: playlistDetail } = playlistDetails;

  //const url =
  //'https://images.unsplash.com/photo-1470217957101-da7150b9b681?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2148&q=80';

  const playlist = useRef(null);
  const [showButton, setShowButton] = useState(false);

  // Refresh playlist if review exists
  useEffect(() => {
    if (review) {
      dispatch(listPlaylistDetails());
    }

    return () => dispatch({ type: PLAYLIST_DETAILS_RESET });
  }, [review, dispatch]);

  // This will set the scroll button for playlist if there is a scrollbar
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (
        playlist.current &&
        playlist.current.scrollWidth > playlist.current.clientWidth
      ) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [playlist, playlistDetail]);

  const scroll = (scrollOffset) => {
    playlist.current.scrollLeft += scrollOffset;
  };

  const mediaHandler = (media) => {
    dispatch(listMediaDetails(media.id));
    dispatch(listFeedbacks(media.id));
    dispatch({ type: FEEDBACK_CREATE_RESET });
  };

  const styleDefault = {
    height: '83px',
    opacity: '0.5',
    filter: 'grayscale(60%)',
  };

  const styleSelect = {
    height: '83px',
  };

  const getStyle = (p) => {
    let style = media && media.id === p.id ? styleSelect : styleDefault;
    if (p.child && media && style === styleDefault) {
      const ids = p.child.map((c) => c.id);
      style = ids.includes(media.id) ? styleSelect : styleDefault;
    }
    return style;
  };

  const getMultiIcon = (p) => {
    // Check if the current media is same as the p (It's a parent, first version)
    let bgColor = media && media.id === p.id ? 'bg-warning' : 'bg-dark';
    if (p.child && media) {
      const ids = p.child.map((c) => c.id);
      bgColor = ids.includes(media.id) ? 'bg-info' : bgColor;
      // This will check the current media is the last version
      bgColor = media.id === p.child[0].id ? 'bg-success' : bgColor;
    }

    return (
      <span
        style={{ position: 'absolute', top: '0px', left: '0px' }}
        className={`material-icons-round ${bgColor}`}
      >
        {`${
          p.child.length < 9 ? `filter_${p.child.length + 1}` : 'filter_9_plus'
        }`}
      </span>
    );
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <div
          ref={playlist}
          className='outer-wrapper'
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#303030',
            borderRadius: '.25rem',
            paddingTop: '0.4rem',
            overflow: 'auto',
            position: 'relative',
            whiteSpace: 'nowrap',
            minHeight: '95px',
          }}
        >
          {playlistDetail &&
            playlistDetail.map((p, idx) => (
              //{Array.from(Array(4).keys()).map((p, idx) => (
              //TODO: Tooltip to show media name
              <div
                key={idx}
                style={{
                  height: '5rem',
                  display: 'inline',
                  borderRadius: '0px',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                className='noselect'
                onClick={() =>
                  p.child ? mediaHandler(p.child[0]) : mediaHandler(p)
                }
              >
                <OverlayTrigger
                  placement='top'
                  overlay={<Tooltip id='button-tooltip'>{p.mediaName}</Tooltip>}
                >
                  <Image
                    variant='top'
                    src={p.child ? p.child[0].asset.imageUrl : p.asset.imageUrl}
                    //src={url}
                    style={getStyle(p)}
                  />
                </OverlayTrigger>
                {p.child && getMultiIcon(p)}
              </div>
            ))}
        </div>
        {showButton && (
          <>
            <div
              className='noselect'
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.4)',
                height: '5.3rem',
                top: '5px',
                cursor: 'pointer',
              }}
              onClick={() => scroll(-60)}
            >
              <span
                className='material-icons-round'
                style={{ transform: 'translate(0, 30px)' }}
              >
                chevron_left
              </span>
            </div>
            <div
              className='noselect'
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,0.4)',
                height: '5.3rem',
                top: '5px',
                cursor: 'pointer',
                right: '0px',
              }}
              onClick={() => scroll(60)}
            >
              <span
                className='material-icons-round'
                style={{ transform: 'translate(0, 30px)' }}
              >
                chevron_right
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Playlist;
