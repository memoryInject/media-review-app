// Faltten the formatted feedback
function getFlattened(data, outputArray, depth) {
  data.forEach((elem) => {
    if (!elem.parent) {
      depth = 0;
    }
    if (elem.child) {
      outputArray.push({ ...elem, child: null, depth });
      depth += 1;
      getFlattened(elem.child, outputArray, depth);
      depth -= 1;
    } else {
      outputArray.push({ ...elem, child: null, depth });
    }
  });
  depth -= 1;
}

// This will create childrens list
const getFormattedFeedbacks = (data) => {
  let feedbacks = JSON.parse(JSON.stringify(data));
  let map = {};
  let result = [];

  feedbacks.forEach((f) => {
    if (!f.parent) {
      result.push(f);
    }
    map[`id${f.id}`] = f;
  });

  result.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  feedbacks.forEach((f) => {
    if (f.parent) {
      let parent = map[`id${f.parent.id}`];
      if (parent.child) {
        parent.child.push(f);
      } else {
        parent.child = [];
        parent.child.push(f);
      }
    }
  });

  var flattened = [];
  getFlattened(result, flattened, 0);

  return flattened;
};

export default getFormattedFeedbacks;
