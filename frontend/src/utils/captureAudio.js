// https://addpipe.com/media-recorder-api-demo-audio/
class CaptureAudio {
  constructor() {
    // Media recorder API
    this.gumStream = null; // Stream from getUserMedia()
    this.recorder = null; // MediaRecorder object
    this.chunks = []; // Array of chunks audio data from the browser
    this.extension = null;

    this.blobHandler = null;
    this.errorHandler = null;

    // true on Chrome, false on Firefox
    console.log(
      'audio/webm: ' + MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    );

    // false on Chrome, true on Firefox
    console.log(
      'audio/ogg: ' + MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
    );

    // Set extension
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      this.extension = 'webm';
    } else {
      this.extension = 'ogg';
    }
  }

  setBlobHandler(blobHandler) {
    this.blobHandler = blobHandler;
  }

  setErrorHandler(errorHandler) {
    this.errorHandler = errorHandler;
  }

  startRecording() {
    console.log('recordButton clicked');
    /*
      Simple constraints object, for more advanced audio features see
      https://addpipe.com/blog/audio-constraints-getusermedia/
      */
    const constraints = { audio: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log(
          'getUserMedia() success, stream created, initializing MediaRecorder'
        );
        // Assign to gumStream for later use
        this.gumStream = stream;

        const options = {
          audioBitsPerSecond: 256000,
          videoBitsPerSecond: 2500000,
          bitsPerSecond: 2628000,
          mimeType: 'audio/' + this.extension + ';codecs=opus',
        };

        console.log(
          'Sample rate: 48kHz, MIME: audio/' + this.extension + ';codecs=opus'
        );

        // Create the MediaRecorder object
        this.recorder = new MediaRecorder(stream, options);

        // When data became available add it to our array of audio data
        this.recorder.ondataavailable = (e) => {
          console.log('recorder.ondataavailable: ' + e.data);

          console.log(
            'recorder.audioBitsPerSecond: ' + this.recorder.audioBitsPerSecond
          );
          console.log(
            'recorder.videoBitsPerSecond: ' + this.recorder.videoBitsPerSecond
          );
          console.log('recorder.bitsPerSecond: ' + this.recorder.bitsPerSecond);

          // Add stream data to chunks
          this.chunks.push(e.data);

          // If recorder is 'inactive' then recording has finished
          if (this.recorder.state === 'inactive') {
            console.log('recorder is inactive');
            // Convert stream data chunks to a 'webm' audio format as blob
            const blob = new Blob(this.chunks, {
              type: 'audio/' + this.extension,
              bitsPerSecond: 128000,
            });

            this.chunks = []; // reset chunks

            if (this.blobHandler) {
              this.blobHandler(blob);
            }
          }
        };

        this.recorder.onerror = (e) => {
          console.log(e.error);
          if (this.errorHandler) {
            this.errorHandler(`${e.error}`);
          }
        };

        // Start recording using 1 second chunks
        // Chrome and firefox will record one long chunk if not specify the length
        this.recorder.start(1000);
      })
      .catch((err) => {
        console.log('Media device error: ');
        console.log(err);
        if (this.errorHandler) {
          this.errorHandler(`${err}`);
        }
      });
  }

  stopRecording() {
    console.log('stopButton clicked');

    // Tell the recorder to stop the recording
    if (this.recorder) {
      this.recorder.stop();
      console.log('STOP RECORDER');
    }

    // Stop microphone access
    if (this.gumStream) {
      this.gumStream.getAudioTracks()[0].stop();
      console.log('STOP MICROPHONE ACCESS');
    }
  }
}

export default new CaptureAudio();
