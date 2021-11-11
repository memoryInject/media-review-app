const isCollaborator = (user, review) => {
  let result = false;
  review.collaborators.forEach((collab) => {
    if (collab.id === user.id) {
      result = true;
    }
  });

  return result;
};

export default isCollaborator;
