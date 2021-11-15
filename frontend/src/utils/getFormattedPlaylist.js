// This will create childrens list
const getFormattedPlaylist = (data) => {
  let playlist = JSON.parse(JSON.stringify(data));
  let map = {};
  let result = [];

  playlist.forEach((p) => {
    if (!p.parent) {
      result.push(p);
    }
    map[`id${p.id}`] = p;
  });

  result.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  playlist.forEach((p) => {
    if (p.parent) {
      let parent = map[`id${p.parent.id}`];
      if (parent.child) {
        parent.child.push(p);
        parent.child.sort(function (a, b) {
          return new Date(b.version) - new Date(a.version);
        });
      } else {
        parent.child = [];
        parent.child.push(p);
      }
    }
  });

  return result;
};

export default getFormattedPlaylist;
