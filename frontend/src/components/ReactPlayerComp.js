import React, { useState, useRef, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import { Row, Col } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import AnnotationCanvas from '../components/AnnotationCanvas';

import {
  heightPlayer,
  widthPlayer,
  topPlayer,
  currentTimePlayer,
  seekToPlayer,
} from '../actions/playerActions';
import AnnotationImages from './AnnotationImages';

const ReactPlayerComp = () => {
  // React Player states
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [loop, setLoop] = useState(false);
  const [seeking, setSeeking] = useState(false);

  const [volSeeking, setVolSeeking] = useState(false);
  const [showAnnotaionImage, setShowAnnotationImage] = useState(true);

  const player = useRef(null);
  const progressHolder = useRef(null);
  const volProgressHolder = useRef(null);

  const dispatch = useDispatch();

  const playerDetails = useSelector((state) => state.playerDetails);
  const { seekTo, top } = playerDetails;

  const annotationDeatils = useSelector((state) => state.annotationDeatils);
  const { active } = annotationDeatils;

  const feedbackList = useSelector((state) => state.feedbackList);
  const { feedbacks } = feedbackList;

  const mediaDetails = useSelector((state) => state.mediaDetails);
  const { media, loading, error } = mediaDetails;

  // For jumpto specific feedback when user click the feeedback
  useEffect(() => {
    if (seekTo !== -1 && player.current) {
      setPlaying(false);
      setSeeking(true);
      player.current.seekTo(seekTo, 'seconds');
      dispatch(seekToPlayer(-1));
      setSeeking(false);
    }

    //return () => dispatch(seekToPlayer(0));
  }, [seekTo, dispatch]);

  useEffect(() => {
    const updateWindowDimensions = () => {
      if (player) {
        dispatch(heightPlayer(player.current.wrapper.clientHeight));
        dispatch(widthPlayer(player.current.wrapper.clientWidth));
        dispatch(topPlayer(player.current.wrapper.offsetTop));
      }
    };

    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, [dispatch]);

  const onReadyHandler = () => {
    if (player) {
      dispatch(heightPlayer(player.current.wrapper.clientHeight));
      dispatch(widthPlayer(player.current.wrapper.clientWidth));
      dispatch(topPlayer(player.current.wrapper.offsetTop));
    }
  };

  const handlePlayPause = () => {
    setSeeking(false);
    setPlaying(!playing);
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleToggleLoop = () => {
    setLoop(!loop);
  };

  const handleEnded = () => {
    setPlaying(loop);
  };

  const handleProgress = (state) => {
    dispatch(currentTimePlayer(state.playedSeconds));

    setSeconds(state.playedSeconds);

    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (state) => {
    setDuration(state);
  };

  const getTimeFormat = (timeInSeconds) => {
    const secToDate = new Date(timeInSeconds * 1000).toISOString();
    return `${secToDate.substr(14, 5)}:${secToDate.substr(20, 2)}`;
  };

  const handleNextFrame = () => {
    setSeeking(true);
    const nextFrame = seconds + 1.0 / 24.0;
    player.current.seekTo(
      nextFrame > duration ? duration : nextFrame,
      'seconds'
    );
    setSeeking(false);
  };

  const handlePrevFrame = () => {
    setSeeking(true);
    const prevFrame = seconds - 1.0 / 24.0;
    player.current.seekTo(prevFrame < 0 ? 0 : prevFrame, 'seconds');
    setSeeking(false);
  };

  const handleClickFullScreen = () => {
    screenfull.request(findDOMNode(player.current));
  };

  // Playback Slider Setup
  const getSliderValue = (e) => {
    const rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left < 0.0023 ? 0 : e.clientX - rect.left;
    let value = x / progressHolder.current.offsetWidth;
    if (value > 0.994) {
      value = 0.9999;
    }

    if (value < 0.0023) {
      value = 0;
    }

    return value;
  };

  const mouseDownSliderHandler = (e) => {
    setSeeking(true);
  };

  const mouseUpSliderHandler = (e) => {
    const value = getSliderValue(e);
    setSeeking(false);
    player.current.seekTo(value);
  };

  const mouseMoveSliderHandler = (e) => {
    if (seeking) {
      const value = getSliderValue(e);
      setPlayed(parseFloat(value));

      // Interactive scrubbing
      player.current.seekTo(parseFloat(value));
    }
  };

  // Volume Slider Setup
  const getVolSliderValue = (e) => {
    const rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left < 0.0023 ? 0 : e.clientX - rect.left;
    let value = x / volProgressHolder.current.offsetWidth;
    if (value > 0.994) {
      value = 0.9999;
    }

    if (value < 0.0023) {
      value = 0;
    }

    return value;
  };

  const volMouseDownSliderHandler = (e) => {
    setVolSeeking(true);
    const value = getVolSliderValue(e);
    console.log(value);
  };

  const volMouseUpSliderHandler = (e) => {
    const value = getVolSliderValue(e);
    setVolSeeking(false);
    setVolume(value);
  };

  const volMouseMoveSliderHandler = (e) => {
    if (volSeeking) {
      setMuted(false);
      const value = getVolSliderValue(e);
      setVolume(value);
    }
  };

  const volMuteHandler = (e) => {
    setMuted(!muted);
  };

  const showAnnotaionImageHandler = () => {
    setShowAnnotationImage(!showAnnotaionImage);
  };

  return (
    <div className='player-wrapper'>
      <Row>
        <Col style={{ position: 'relative' }}>
          {error && <Message>{error}</Message>}
          {loading && (
            <>
              <div
                style={{
                  zIndex: '12',
                  height: '15vh',
                  width: '100%',
                }}
              ></div>
              <Loader />
              <div
                style={{
                  zIndex: '12',
                  height: '15vh',
                  width: '100%',
                }}
              ></div>
            </>
          )}
          {media && media.asset.url && (
            <ReactPlayer
              url={media.asset.url}
              width='100%'
              height='100%'
              ref={player}
              playing={playing}
              controls={false}
              light={false}
              loop={loop}
              playbackRate={1.0}
              volume={volume}
              muted={muted}
              onReady={onReadyHandler}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onError={(e) => console.log('onError', e)}
              onProgress={handleProgress}
              onDuration={handleDuration}
              progressInterval={1}
              style={{ backgroundColor: 'black' }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              zIndex: '12',
              top: `${top}px`,
            }}
          >
            {active && <AnnotationCanvas />}
          </div>
          <div
            style={{
              position: 'absolute',
              zIndex: '10',
              top: `${top}px`,
            }}
          >
            {showAnnotaionImage && <AnnotationImages />}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {/*Play progress bar*/}
          <div className='rp-progress-control'>
            <div
              onMouseDown={(e) => mouseDownSliderHandler(e)}
              onMouseUp={(e) => mouseUpSliderHandler(e)}
              onMouseMove={(e) => mouseMoveSliderHandler(e)}
              ref={progressHolder}
              className='rp-progress-holder'
            >
              <div
                className='rp-play-progress'
                style={{ width: `${played * 100}%` }}
              ></div>
            </div>

            {/*Annotation bar start*/}
            {feedbacks &&
              feedbacks.map((f, idx) => (
                <div
                  key={idx}
                  className='noselect'
                  style={{
                    position: 'absolute',
                    marginTop: '0.2rem',
                    marginLeft: `${(f.mediaTime / duration) * 100}%`,
                    left: `${
                      f.mediaTime < 0.3
                        ? 0
                        : f.mediaTime > duration - 0.35
                        ? -12
                        : -6
                    }px`,
                    cursor: 'pointer',
                  }}
                  onClick={() => dispatch(seekToPlayer(f.mediaTime))}
                >
                  <span
                    className='material-icons-round'
                    style={{
                      fontSize: '12px',
                      color: '#3498db',
                    }}
                  >
                    fiber_manual_record
                  </span>
                </div>
              ))}
            {/*Annotation bar end*/}
          </div>
        </Col>
      </Row>

      <div
        className='playback-controls'
        style={{
          paddingTop: '0.3rem',
        }}
      >
        <Row>
          <Col style={{ position: 'relative' }}>
            {/*Play Button*/}
            <div
              onClick={() => handlePlayPause()}
              style={{
                cursor: 'pointer',
                display: 'inline',
                padding: '0.25rem',
              }}
              className='noselect'
            >
              {playing ? (
                <span className='material-icons-round' style={styleSize}>
                  pause
                </span>
              ) : (
                <span className='material-icons-round' style={styleSize}>
                  play_arrow
                </span>
              )}
            </div>

            {/*Loop Button*/}
            <div
              onClick={() => handleToggleLoop()}
              style={{
                cursor: 'pointer',
                display: 'inline',
                padding: '0.25rem',
              }}
              className='noselect'
            >
              {loop ? (
                <span className='material-icons-round' style={styleSize}>
                  repeat
                </span>
              ) : (
                <span
                  className='material-icons-round'
                  style={{ fontSize: styleSize.fontSize, color: '#292929' }}
                >
                  repeat
                </span>
              )}
            </div>

            {/*Frame Backward*/}
            <div
              className='noselect'
              style={{
                cursor: 'pointer',
                display: 'inline',
                padding: '0.25rem',
              }}
              onClick={() => handlePrevFrame()}
            >
              <span className='material-icons-round' style={styleSize}>
                chevron_left
              </span>
            </div>

            {/*Frame Forward*/}
            <div
              className='noselect'
              style={{
                cursor: 'pointer',
                display: 'inline',
                padding: '0.25rem',
              }}
              onClick={() => handleNextFrame()}
            >
              <span className='material-icons-round' style={styleSize}>
                chevron_right
              </span>
            </div>

            {/*Volume Button*/}
            <div
              onClick={(e) => volMuteHandler(e)}
              className='noselect'
              style={{
                cursor: 'pointer',
                display: 'inline',
                padding: '0.25rem',
              }}
            >
              {muted ? (
                <span className='material-icons-round' style={styleSize}>
                  volume_off
                </span>
              ) : volume > 0.5 ? (
                <span className='material-icons-round' style={styleSize}>
                  volume_up
                </span>
              ) : volume > 0.1 ? (
                <span className='material-icons-round' style={styleSize}>
                  volume_down
                </span>
              ) : (
                <span className='material-icons-round' style={styleSize}>
                  volume_mute
                </span>
              )}
            </div>

            {/*Volume controller*/}
            <div
              className='rp-volume-control noselect'
              onMouseDown={(e) => volMouseDownSliderHandler(e)}
              onMouseUp={(e) => volMouseUpSliderHandler(e)}
              onMouseMove={(e) => volMouseMoveSliderHandler(e)}
              ref={volProgressHolder}
            >
              <div className='rp-volume-holder'>
                <div
                  className='rp-volume-range'
                  style={{ width: `${muted ? 0 : volume * 100}%` }}
                ></div>
              </div>
            </div>
          </Col>
          <Col md={3} className='d-none d-sm-block d-sm-none d-md-block'>
            {/*Time Duration Start*/}
            <div
              style={{
                display: 'inline',
                position: 'relative',
                fontSize: '14px',
              }}
            >
              <span>{getTimeFormat(seconds)}</span>
              <span>&nbsp;/&nbsp;</span>
              <span>{getTimeFormat(duration)}</span>
            </div>
            {/*Time Duration End*/}
          </Col>

          <Col
            md={2}
            xs={3}
            style={{ position: 'relative', marginLeft: '0.3rem' }}
          >
            {/*Full Screen Button*/}
            <div
              className='noselect text-end'
              style={{
                cursor: 'pointer',
                marginRight: '0.25rem',
              }}
            >
              {screenfull.isFullscreen ? (
                <span
                  className='material-icons-round'
                  onClick={() => handleClickFullScreen()}
                  style={styleSize}
                >
                  fullscreen_exit
                </span>
              ) : (
                <>
                  {/*Display Annotation Button*/}
                  <span
                    onClick={showAnnotaionImageHandler}
                    className='material-icons-round noselect'
                    style={{
                      cursor: 'pointer',
                      fontSize: '20px',
                      transform: 'translate(-6px, -3px)',
                      color: `${showAnnotaionImage ? '#FFFFFF' : '#222222'}`,
                    }}
                  >
                    brush
                  </span>
                  <span
                    onClick={() => handleClickFullScreen()}
                    className='material-icons-round'
                    style={styleSize}
                  >
                    fullscreen
                  </span>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const styleSize = {
  fontSize: '26px',
};

export default ReactPlayerComp;
