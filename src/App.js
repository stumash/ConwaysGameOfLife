import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { makeMatrix } from "./utils.js";
import { updateGameOfLife, animateGameOfLife, drawGridLines } from "./conwayUtils.js";
import constants from "./constants.js";

const CELL_SIZE = 10
const CANVAS_WIDTH = 50
const CANVAS_HEIGHT = 50
const CLOCK_MILLIS = 500

const MERGED_CONSTANTS = {
  CELL_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, CLOCK_MILLIS, ...constants,
}

const INITIAL_GRID = (() => {
  const grid = makeMatrix({
    dims: [CANVAS_WIDTH, CANVAS_HEIGHT],
    defaultValue: false
  })
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
  return grid
})()

const App = () => {
  const gridRef = useRef(INITIAL_GRID);
  const gameCanvasRef = useRef(null);
  const gridCanvasRef = useRef(null);

  const [isGameRunning, setIsGameRunning] = useState(false);
  const toggleIsGameRunning = () => setIsGameRunning((wasGameRunning) => !wasGameRunning);

  useEffect(() => {
    drawGridLines(gridCanvasRef.current.getContext("2d"), MERGED_CONSTANTS)
  }, [])

  useEffect(() => {
    // dont start the loop if the game isnt running
    if (!isGameRunning) {
      return;
    }

    // start the loop
    const grid  = gridRef.current
    const c = gameCanvasRef.current.getContext("2d");
    animateGameOfLife(grid, c, MERGED_CONSTANTS);
    const clockID = setInterval(() => {
      updateGameOfLife(grid);
      animateGameOfLife(grid, c, MERGED_CONSTANTS);
    }, CLOCK_MILLIS);

    // cancel the loop when isGameRunning's value changes
    return () => clearInterval(clockID)
  }, [isGameRunning]);

  const handleCanvasClicked = (evt) => {
    if (!isGameRunning) {
      return
    }
    evt.stopPropagation();
    const canvas = gameCanvasRef.current
    const grid = gridRef.current
    const rect = canvas.getBoundingClientRect();
    const x = evt.nativeEvent.clientX - rect.left;
    const y = evt.nativeEvent.clientY - rect.top;

    const i = Math.floor(x / CELL_SIZE);
    const j = Math.floor(y / CELL_SIZE);

    if (i >= 0 && j >= 0 && i < grid.length && j < grid[0].length) {
      grid[i][j] = !grid[i][j];
    }
    animateGameOfLife(grid, canvas.getContext("2d"), MERGED_CONSTANTS);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Conway's Game of Life</div>
        <div className="canvasContainer" width={CANVAS_WIDTH * CELL_SIZE}
            height={CANVAS_HEIGHT * CELL_SIZE}>
          <canvas
            width={CANVAS_WIDTH * CELL_SIZE}
            height={CANVAS_HEIGHT * CELL_SIZE}
            ref={gameCanvasRef}
            onClick={handleCanvasClicked}
            className="gameCanvas"
          ></canvas>
          <canvas
            width={CANVAS_WIDTH * CELL_SIZE}
            height={CANVAS_HEIGHT * CELL_SIZE}
            ref={gridCanvasRef}
            className="gridCanvas"
          ></canvas>
        </div>
        <div id="control-panel">
          <button type="button" onClick={toggleIsGameRunning}>
            {isGameRunning ? "stop" : "run"}
          </button>
        </div>
      </header>
    </div>
  )
}

export default App;
