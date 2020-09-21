import { makeMatrix } from "./utils.js";

function updateGameOfLife(grid) {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const newGrid = makeMatrix({
    dims: [numRows, numCols],
    defaultValue: false
  });
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      // rules of Conway's 'Game of Life'
      const livingNeighborCount = countLivingNeighbors(grid, i, j);
      if (grid[i][j]) {
        // if alive:
        if (livingNeighborCount <= 1) {
          // die by underpopulation
          newGrid[i][j] = false;
        } else if (livingNeighborCount <= 3) {
          // stay alive
          newGrid[i][j] = true;
        } else {
          // die by overpopulation
          newGrid[i][j] = false;
        }
      } else {
        // if dead:
        if (livingNeighborCount === 3) {
          // come to life by reproduction
          newGrid[i][j] = true;
        }
      }
    }
  }

  // copy newGrid to grid
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = newGrid[i][j];
    }
  }
}

function countLivingNeighbors(grid, i, j) {
  return [
    [i - 1, j + 1],
    [i - 1, j],
    [i - 1, j - 1],
    [i, j + 1],
    [i, j - 1],
    [i + 1, j + 1],
    [i + 1, j],
    [i + 1, j - 1]
  ]
    .filter(([ii, jj]) => ii >= 0 && jj >= 0 && ii < grid.length && jj < grid[0].length)
    .map(([ii, jj]) => (grid[ii][jj] ? 1 : 0)) // 1 if alive, 0 if dead
    .reduce((x, y) => x + y, 0); // sum
}

function animateGameOfLife(grid, pencil, settings) {
  const MAX_WIDTH = settings.CANVAS_WIDTH * settings.CELL_SIZE;
  const MAX_HEIGHT = settings.CANVAS_HEIGHT * settings.CELL_SIZE;

  pencil.fillStyle = settings.WHITE;
  pencil.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT);

  pencil.fillStyle = settings.GREEN;
  drawLivingCells(grid, pencil, settings);

  pencil.fillStyle = settings.BLACK;
  drawGridLines(grid, pencil, settings);
}

function drawLivingCells(grid, pencil, settings) {
  const CELL_SIZE = settings.CELL_SIZE;
  const numRows = grid.length;
  const numCols = grid[0].length;
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j]) {
        // draw cell
        pencil.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}
function drawGridLines(_, pencil, settings) {
  const CELL_SIZE = settings.CELL_SIZE;
  for (let i = 0; i <= settings.CANVAS_WIDTH; i++) {
    pencil.moveTo(i * CELL_SIZE, 0);
    pencil.lineTo(i * CELL_SIZE, settings.CANVAS_HEIGHT * CELL_SIZE);
    pencil.stroke();
  }
  for (let j = 0; j <= settings.CANVAS_HEIGHT; j++) {
    pencil.moveTo(0, j * CELL_SIZE);
    pencil.lineTo(settings.CANVAS_WIDTH * CELL_SIZE, j * CELL_SIZE);
    pencil.stroke();
  }
}

export { updateGameOfLife, animateGameOfLife };
