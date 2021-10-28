import React from 'react';

import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '50px',
        height: '50px',
        margin: 'auto',
        display: 'block',
        transition: 'all 0.5s ease-in-out',
      }}
    >
      {/*<span className='sr-only'>Loading...</span>*/}
    </Spinner>
  );
};

export default Loader;
