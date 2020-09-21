// done recursively for fun
const makeMatrix = ({ dims, defaultValue }) => {
  if (dims.length > 2) {
    throw new Error("cannot accept more than two dims for valid matrix");
  } else if (dims.length === 2) {
    return Array(dims[0])
      .fill(null)
      .map(_ => makeMatrix({ dims: dims.slice(1), defaultValue }));
  } else if (dims.length === 1) {
    return Array(dims[0]).fill(defaultValue);
  } else {
    throw new Error("dims cannot be zero");
  }
};

export { makeMatrix };
