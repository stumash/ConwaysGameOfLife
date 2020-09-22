import constants from "./constants.js";

export function makeInitialGrid() {
  const grid = makeMatrix({
    dims: [constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT],
    defaultValue: false
  });

  // start a pentadecathlon by default
  const alive = [
    [25, 9],
    [25, 10],
    [24, 11],
    [26, 11],
    [25, 12],
    [25, 13],
    [25, 14],
    [25, 15],
    [24, 16],
    [26, 16],
    [25, 17],
    [25, 18]
  ];
  for (let [i, j] of alive) {
    grid[i][j] = true;
  }

  return grid;
}

// done recursively for fun
export function makeMatrix({ dims, defaultValue }) {
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
}
