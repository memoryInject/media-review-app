import { Offcanvas } from 'react-bootstrap';

const Notifications = ({ placement, show, onHide }) => {
  return (
    <Offcanvas show={show} placement={placement} onHide={onHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Notifiactions</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>Place holder text Offcanvas body</Offcanvas.Body>
    </Offcanvas>
  );
};

export default Notifications;
