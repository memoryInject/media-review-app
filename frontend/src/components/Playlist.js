import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Image } from 'react-bootstrap';
import {listMediaDetails} from '../actions/mediaActions';
import {listFeedbacks} from '../actions/feedbackActions';
import {FEEDBACK_CREATE_RESET} from '../constants/feedbackConstants';

const Playlist = () => {
  const dispatch = useDispatch();
  const mediaDetails = useSelector((state) => state.mediaDetails);
  const { media } = mediaDetails;

  const reviewDetails = useSelector((state) => state.reviewDetails);
  const { review } = reviewDetails;

  const playerDetails = useSelector((state) => state.playerDetails);
  const { width } = playerDetails;
  const url =
    'https://images.unsplash.com/photo-1470217957101-da7150b9b681?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2148&q=80';

  const playlist = useRef(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (
      playlist.current &&
      playlist.current.scrollWidth > playlist.current.clientWidth
    ) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [playlist]);

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
  }

  const styleSelect= {
    height: '83px',
  }

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
          {review.media.map((m, idx) => (
          //{Array.from(Array(4).keys()).map((m, idx) => (
            <div
              key={idx}
              style={{
                height: '5rem',
                display: 'inline',
                borderRadius: '0px',
                cursor: 'pointer',
              }}
              className='noselect'
              onClick={()=>mediaHandler(m)}
            >
              <Image
                variant='top'
                src={m.asset.imageUrl}
                //src={url}
                style={media && media.id === m.id ? styleSelect : styleDefault}
              />
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
                left: `${width - 23}px`,
                cursor: 'pointer',
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
