import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, time, children, fix }) => {
  const [delay, setDelay] = useState(true);
  useEffect(() => {
    const timerId = setTimeout(() => setDelay(false), time);
    return () => clearTimeout(timerId);
  }, [delay, time]);

  return (
    <>
      {fix ? (
        <Alert variant={variant}>{children}</Alert>
      ) : (
        delay && <Alert variant={variant}>{children}</Alert>
      )}
    </>
  );
};

Message.defaultProps = {
  variant: 'danger',
  time: 10000,
};

export default Message;
