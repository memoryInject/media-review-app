 //https://www.html5rocks.com/en/tutorials/eventsource/basics/
class EventStream {
  constructor() {
    this.source = null;
    this.data = null;
    this.url = null;
    this.errorHandler = null;
    this.dataHandler = null;
    this.logHandler = null;
  }

  setErrorHandler(errorHandler) {
    this.errorHandler = errorHandler;
  }

  setDataHandler(dataHandler) {
    this.dataHandler = dataHandler;
  }

  setLogHandler(logHandler) {
    this.logHandler = logHandler;
  }

  startStream(url) {
    if (this.source) {
      this.source.close();
    }

    this.url = url;
    this.source = new EventSource(this.url);
    this.source.onopen = function () {
      const msg = 'connection to the stream has been opened';
      if (this.logHandler) {
        this.logHandler(msg);
      } else {
        console.log(msg);
      }
    };

    this.source.onerror = function (error) {
      if (this.errorHandler) {
        this.errorHandler(error);
      } else {
        console.log('ERROR..', error);
      }
    };

    this.source.onmessage = (stream) => {
      // const data = JSON.parse(e.data);
      if (this.logHandler) {
        this.logHandler(stream)
      } else {
        console.log('recieved stream: ', stream);
      }

      try {
        this.data = JSON.parse(stream.data);
      } catch (e) {
        console.log(e);
        this.data = stream.data;
      }

      if (this.dataHandler) {
        this.dataHandler(this.data);
      }
    };
  }
}

export default new EventStream();
