const getError = (error) => {
  let message = error.message;

  if (error.request && error.request.responseText) {
    message = error.request.responseText
      .replace(/{|}|\[|\]|"/g, '')
      .replace(':', ': ');
  }

  return message;
};

export default getError;
