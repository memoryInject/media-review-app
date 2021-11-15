import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const About = (props) => {
  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          <span
            className='material-icons-round'
            style={{ transform: 'translate(0, 4px)' }}
          >
            movie
          </span>
          &nbsp; About
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Media-Review-App</h4>
        <p>
          Media review is a platform for review media by team collaboration in
          cloud, integrates reviewers, creators, content and tools needs to be
          more engaged and effective review process.
        </p>
        <p>
          For more info: &nbsp;
          <a
            href='https://www.memoryinject.io'
            target='_blank'
            rel='noreferrer'
          >
            memoryinject.io
          </a>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default About;
