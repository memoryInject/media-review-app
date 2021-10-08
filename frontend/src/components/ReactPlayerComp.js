import React, { useState, useRef, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';

const ReactPlayerComp = ({ url }) => {
  const [pip, setPip] = useState(false); // pip - picture in picture
  const [playing, setPlaying] = useState(false);
  const [controls, setControls] = useState(false);
  const [light, setLight] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loop, setLoop] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [volSeeking, setVolSeeking] = useState(false);

  const player = useRef(null);
  const progressHolder = useRef(null);
  const volProgressHolder = useRef(null);

  const handlePlayPause = () => {
    setSeeking(false);
    setPlaying(!playing);
  };

  const handlePlay = () => {
    console.log('onPlay');
    setPlaying(true);
  };

  const handlePause = () => {
    console.log('onPause');
    setPlaying(false);
  };

  const handleToggleLoop = () => {
    setLoop(!loop);
  };

  const handleEnded = () => {
    console.log('onEnded');
    setPlaying(loop);
  };

  const handleProgress = (state) => {
    setSeconds(state.playedSeconds);
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (state) => {
    setDuration(state);
  };

  const getCurrentTime = () => {
    const secToDate = new Date(seconds * 1000).toISOString();
    return `${secToDate.substr(14, 5)}:${secToDate.substr(20, 2)}`;
  };

  const getTotalTime = () => {
    const secToDate = new Date(duration * 1000).toISOString();
    return `${secToDate.substr(14, 5)}:${secToDate.substr(20, 2)}`;
  };

  const handleNextFrame = () => {
    setSeeking(true)
    const nextFrame = seconds + (1.0/24.0)
    player.current.seekTo(nextFrame > duration ? duration : nextFrame, 'seconds')
    setSeeking(false)
  };

  const handlePrevFrame = () => {
    setSeeking(true)
    const prevFrame = seconds - (1.0/24.0)
    player.current.seekTo(prevFrame < 0 ? 0 : prevFrame, 'seconds')
    setSeeking(false)
  };

  const handleClickFullScreen = () => {
    // TO DO
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

  return (
    <div className='player-wrapper'>
      <Row>
        <Col>
          <ReactPlayer
            url={url}
            width='100%'
            height='100%'
            ref={player}
            playing={playing}
            controls={controls}
            light={light}
            loop={loop}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            onReady={() => console.log('onReady')}
            onStart={() => console.log('onStart')}
            onPlay={handlePlay}
            onPause={handlePause}
            onBuffer={() => console.log('onBuffer')}
            onSeek={(e) => console.log('onSeek', e)}
            onEnded={handleEnded}
            onError={(e) => console.log('onError', e)}
            onProgress={handleProgress}
            onDuration={handleDuration}
            progressInterval={1}
            style={{ backgroundColor: 'black' }}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          {/*Play progress bar*/}
          <div
            onMouseDown={(e) => mouseDownSliderHandler(e)}
            onMouseUp={(e) => mouseUpSliderHandler(e)}
            onMouseMove={(e) => mouseMoveSliderHandler(e)}
            ref={progressHolder}
            className='rp-progress-control'
          >
            <div className='rp-progress-holder'>
              <div
                className='rp-play-progress'
                style={{ width: `${played * 100}%` }}
              ></div>
            </div>
          </div>
        </Col>
      </Row>

      <div className='playback-controls'>
        <Row>
          <Col md='auto'>
            {/*Play Button*/}
            <div
              onClick={() => handlePlayPause()}
              style={{ cursor: 'pointer'}}
              className='noselect'
            >
              {playing ? (
                <span
                  className='material-icons-round'
                  style={styleSize}
                >
                  pause
                </span>
              ) : (
                <span
                  className='material-icons-round'
                  style={styleSize}
                >
                  play_arrow
                </span>
              )}
            </div>
          </Col>

          <Col md='auto'>
            {/*Loop Button*/}
            <div
              onClick={() => handleToggleLoop()}
              style={{ cursor: 'pointer'}}
              className='noselect'
            >
              {loop ? (
                <span
                  className='material-icons-round'
                  style={styleSize}
                >
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
          </Col>

          <Col md='auto'>
            {/*Frame Backward*/}
            <div
              className='noselect'
              style={{ cursor: 'pointer'}}
              onClick={() => handlePrevFrame()}
            >
              <span class='material-icons-round' style={styleSize}>
                chevron_left
              </span>
            </div>
          </Col>

          <Col md='auto'>
            {/*Frame Forward*/}
            <div
              className='noselect'
              style={{ cursor: 'pointer'}}
              onClick={() => handleNextFrame()}
            >
              <span class='material-icons-round' style={styleSize}>
                chevron_right
              </span>
            </div>
          </Col>

          <Col md='auto'>
            {/*Volume Button*/}
            <div
              onClick={(e) => volMuteHandler(e)}
              className='noselect'
              style={{ cursor: 'pointer'}}
            >
              {muted ? (
                <span class='material-icons-round' style={styleSize}>
                  volume_off
                </span>
              ) : volume > 0.5 ? (
                <span class='material-icons-round' style={styleSize}>
                  volume_up
                </span>
              ) : volume > 0.1 ? (
                <span class='material-icons-round' style={styleSize}>
                  volume_down
                </span>
              ) : (
                <span class='material-icons-round' style={styleSize}>
                  volume_mute
                </span>
              )}
            </div>
          </Col>

          <Col md='auto'>
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

          {/*Time Duration Start*/}
          <Col md='auto'>
            <h6 style={{marginTop: '0.20rem'}}>{getCurrentTime()}</h6>
          </Col>

          <Col md='auto'>
            <h6 style={{marginTop: '0.20rem'}}>/</h6>
          </Col>

          <Col md='auto'>
            <h6 style={{marginTop: '0.20rem'}}>{getTotalTime()}</h6>
          </Col>
          {/*Time Duration End*/}

          <Col>
            <div
              className='noselect'
              style={{
                textAlign: 'right',
              }}
            >
              <div
                onClick={() => handleClickFullScreen()}
                className='noselect'
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                {screenfull.isFullscreen ? (
                  <span
                    class='material-icons-round'
                    style={styleSize}
                  >
                    fullscreen_exit
                  </span>
                ) : (
                  <span
                    class='material-icons-round'
                    style={styleSize}
                  >
                    fullscreen
                  </span>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const styleSize = {
  fontSize: '26px'
}

export default ReactPlayerComp;
