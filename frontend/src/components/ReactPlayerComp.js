import React, { useState, useRef, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';

const ReactPlayerComp = () => {
  const video_url =
    'https://media.istockphoto.com/videos/beautiful-universally-cloudscape-background-time-lapse-video-id1156186888';

  const [url, setUrl] = useState(null);
  const [pip, setPip] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [controls, setControls] = useState(false);
  const [light, setLight] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loop, setLoop] = useState(false);

  const [seeking, setSeeking] = useState(false);

  const player = useRef(null);

  useEffect(() => {
    if (url === null) {
      setUrl(video_url);
    }
  }, []);

  const load = (url) => {
    setUrl(url);
    setPlayed(0);
    setLoaded(0);
    setPip(false);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleStop = () => {
    // setUrl(null);
    setPlaying(false);
  };

  const handleToggleControls = () => {
    setControls(!controls);
    setUrl(null);
    load(url);
  };

  const handleToggleLight = () => {
    setLight(!light);
  };

  const handleToggleLoop = () => {
    setLoop(!loop);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleToggleMuted = () => {
    setMuted(!muted);
  };

  const handleSetPlaybackRate = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handleTogglePIP = () => {
    setPip(!pip);
  };

  const handlePlay = () => {
    console.log('onPlay');
    setPlaying(true);
  };

  const handleEnablePIP = () => {
    console.log('onEnablePIP');
    setPip(true);
  };

  const handleDisablePIP = () => {
    console.log('onDisablePIP');
    setPip(false);
  };

  const handlePause = () => {
    console.log('onPause');
    setPlaying(false);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));

    // Interactive scrubbing
    player.current.seekTo(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    player.current.seekTo(parseFloat(e.target.value));
  };

  const handleProgress = (state) => {
    // console.log('onProgress', state);
    // console.log('frame', parseInt(duration * played * 24));

    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      // TO DO
      // console.log(seeking)
      // this.setState(state)
      setPlayed(state.played);
    }
  };

  const handleEnded = () => {
    console.log('onEnded');
    setPlaying(loop);
  };

  const handleDuration = (state) => {
    console.log('onDuration', state);
    // TO DO
    setDuration(state);
    // this.setState({ duration })
  };

  const handleClickFullScreen = () => {
    // TO DO
    screenfull.request(findDOMNode(player.current));
  };

  const handleNextFrame = () => {
    const frame = parseInt(duration * played * 24);
    const frameToSec = (frame + 1) / 24.0;
    const secToPlayed = frameToSec.toFixed(3) / duration;
    console.log(frame);
    console.log(frameToSec);
    console.log(secToPlayed);
    const correctedVal = secToPlayed + 0.001;
    console.log(correctedVal);

    player.current.seekTo(correctedVal);
  };

  return (
    <>
      <div className='player-wrapper'>
        <ReactPlayer
          url={url}
          width='100%'
          height='100%'
          ref={player}
          pip={pip}
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
          onEnablePIP={handleEnablePIP}
          onDisablePIP={handleDisablePIP}
          onPause={handlePause}
          onBuffer={() => console.log('onBuffer')}
          onSeek={(e) => console.log('onSeek', e)}
          onEnded={handleEnded}
          onError={(e) => console.log('onError', e)}
          onProgress={handleProgress}
          onDuration={handleDuration}
          progressInterval={1}
        />
        <Row>
          <Col>
            <div>
              <h5>Seek</h5>
              <input
                type='range'
                min={0}
                max={0.999999}
                step='any'
                value={played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                style={{ width: '100%' }}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Row>
        <Col>
          <div className='m-3'>
            <h5>Controls</h5>
            <Button type='button' className='btn mx-3' onClick={handleStop}>
              Stop
            </Button>
            <Button
              type='button'
              className='btn mx-3'
              onClick={handlePlayPause}
            >
              {playing ? 'Pause' : 'Play'}
            </Button>

            <Button type='button' className='btn mx-3'>
              Prev Frame
            </Button>

            <Button
              type='button'
              className='btn mx-3'
              onClick={handleNextFrame}
            >
              Next Frame
            </Button>

            <Button
              type='button'
              className='btn mx-3'
              onClick={handleClickFullScreen}
            >
              Full Screen
            </Button>
          </div>

          <div className='m-3'>
            <h5>Loop</h5>
            <input
              id='loop'
              type='checkbox'
              checked={loop}
              onChange={handleToggleLoop}
            />
          </div>
        </Col>

        <Col className='m-3'>
          <h4>State</h4>
          <table>
            <tbody>
              <tr>
                <th>url</th>
                <td className={!url ? 'faded' : ''}>{url}</td>
              </tr>
              <tr>
                <th>playing</th>
                <td>{playing ? 'true' : 'false'}</td>
              </tr>
              <tr>
                <th>volume</th>
                <td>{volume.toFixed(3)}</td>
              </tr>
              <tr>
                <th>played</th>
                <td>{played.toFixed(3)}</td>
              </tr>
              <tr>
                <th>loaded</th>
                <td>{loaded.toFixed(3)}</td>
              </tr>
              <tr>
                <th>duration</th>
                <td>
                  <p>{duration}</p>
                </td>
              </tr>
              <tr>
                <th>elapsed</th>
                <td>
                  <p>{duration * played}</p>
                </td>
              </tr>
              <tr>
                <th>remaining</th>
                <td>
                  <p>{duration * (1 - played)}</p>
                </td>
              </tr>
              <tr>
                <th>frame</th>
                <td>
                  <p>{parseInt(duration * played * 24)}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </>
  );
};

export default ReactPlayerComp;
