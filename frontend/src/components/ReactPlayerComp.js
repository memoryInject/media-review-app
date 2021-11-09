import React, { useState, useRef, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import { Row, Col, Spinner } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import AnnotationCanvas from '../components/AnnotationCanvas';

import {
  heightPlayer,
  widthPlayer,
  topPlayer,
  currentTimePlayer,
  seekToPlayer,
  videoSizePlayer,
} from '../actions/playerActions';
import AnnotationImages from './AnnotationImages';
import { activeFeedback } from '../actions/feedbackActions';

const ReactPlayerComp = () => {
  // React Player states
  const [showPlayer, setShowPlayer] = useState(false);
  const [adjHeight, setAdjHeight] = useState(0);
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
  const { seekTo, top, height, width, videoSize } = playerDetails;

  const annotationDeatils = useSelector((state) => state.annotationDeatils);
  const { active } = annotationDeatils;

  const feedbackList = useSelector((state) => state.feedbackList);
  const { feedbacks } = feedbackList;

  const mediaDetails = useSelector((state) => state.mediaDetails);
  const { media, loading, error } = mediaDetails;

  // While loading hide the player
  useEffect(() => {
    if (loading) {
      setShowPlayer(false);
    }
  }, [loading]);

  useEffect(() => {
    if (!media) {
      setShowPlayer(false);
    } else {
      dispatch(heightPlayer(player.current.wrapper.clientHeight));
      dispatch(widthPlayer(player.current.wrapper.clientWidth));
      dispatch(topPlayer(player.current.wrapper.offsetTop));
    }
  }, [media, dispatch]);

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
      if (player && player.current) {
        dispatch(heightPlayer(player.current.wrapper.clientHeight));
        dispatch(widthPlayer(player.current.wrapper.clientWidth));
        dispatch(topPlayer(player.current.wrapper.offsetTop));
      }
    };

    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, [dispatch]);

  //useEffect(() => {
    //if (player.current) {
      //dispatch(heightPlayer(player.current.wrapper.clientHeight));
      //dispatch(widthPlayer(player.current.wrapper.clientWidth));
      //dispatch(topPlayer(player.current.wrapper.offsetTop));
      //if (
        //player.current.wrapper.childNodes[0] &&
        //progressHolder.current.clientWidth
      //) {
        //const videoHeight = player.current.wrapper.childNodes[0].videoHeight;
        //const videoWidth = player.current.wrapper.childNodes[0].videoWidth;
        //const factor = progressHolder.current.clientWidth / videoWidth;
        //setAdjHeight(Math.ceil(videoHeight * factor));
        //dispatch(
          //videoSizePlayer({
            //height: videoHeight,
            //width: videoWidth,
            //scaleFactor: factor,
          //})
        //);
      //}
    //}
  //}, [height, player, showPlayer, dispatch]);

  const onReadyHandler = () => {
    if (player) {
      const videoHeight = player.current.wrapper.childNodes[0].videoHeight;
      const videoWidth = player.current.wrapper.childNodes[0].videoWidth;
      const factor = progressHolder.current.clientWidth / videoWidth;
      setAdjHeight(Math.ceil(videoHeight * factor));
      setTimeout(() => setShowPlayer(true), 510);
      dispatch(heightPlayer(player.current.wrapper.clientHeight));
      dispatch(widthPlayer(player.current.wrapper.clientWidth));
      dispatch(topPlayer(player.current.wrapper.offsetTop));
      dispatch(
        videoSizePlayer({
          height: videoHeight,
          width: videoWidth,
          scaleFactor: factor,
        })
      );
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
    let fps = media.asset.frameRate ? media.asset.frameRate : 24
    const nextFrame = seconds + 1.0 / fps;
    player.current.seekTo(
      nextFrame > duration ? duration : nextFrame,
      'seconds'
    );
    setSeeking(false);
  };

  const handlePrevFrame = () => {
    setSeeking(true);
    let fps = media.asset.frameRate ? media.asset.frameRate : 24
    const prevFrame = seconds - 1.0 / fps;
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

  const annotaionBarHandler = (feedback) => {
    dispatch(seekToPlayer(feedback.mediaTime));
    dispatch(activeFeedback(feedback));
  };

  return (
    <div className='player-wrapper'>
      <Row>
        <Col style={{ position: 'relative' }}>
          {error && <Message>{error}</Message>}

          {/*Custom Loader*/}
          {true && (
            <>
              <div
                style={{
                  zIndex: '12',
                  minHeight: `${
                    progressHolder.current &&
                    (720 * (progressHolder.current.clientWidth/1280)) + 5.5
                    }px`,
                  height: `${adjHeight + 5.5}px`,
                  width: `${
                    progressHolder &&
                    progressHolder.current &&
                    progressHolder.current.clientWidth
                  }px`,
                  transition: 'all 0.5s ease-in-out',
                  backgroundColor: 'rgba(255, 0, 0, 0)',
                  top: `${top}px`,
                  display: `${showPlayer ? 'none' : 'block'}`,
                  position: 'relative',
                }}
                className='text-center'
              >
                <Spinner
                  animation='border'
                  style={{position: 'absolute', top: '50%'}}
                />
              </div>
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
              style={{
                backgroundColor: 'black',
                display: `${showPlayer ? 'block' : 'none'}`,
                //display: 'none',
                transition: 'all 0.5s ease-in-out',
              }}
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
              showPlayer &&
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
                  onClick={() => annotaionBarHandler(f)}
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

      {/*Playback controls start*/}
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

            <div
              className='noselect d-none d-sm-none d-md-inline'
              style={{ display: 'inline' }}
            >
              {/*Volume Button*/}
              <div
                onClick={(e) => volMuteHandler(e)}
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
            </div>
          </Col>
          <Col md={3} xs={3}>
            {/*Time Duration Start*/}
            <div
              style={{
                display: 'inline',
                position: 'relative',
                fontSize: '14px',
              }}
            >
              <span>{getTimeFormat(seconds)}</span>
              <span className='d-none d-sm-none d-md-inline'>
                &nbsp;/&nbsp;
              </span>
              <span className='d-none d-sm-none d-md-inline'>
                {getTimeFormat(duration)}
              </span>
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
      {/*Playback controls end*/}
    </div>
  );
};

const styleSize = {
  fontSize: '26px',
};

export default ReactPlayerComp;
