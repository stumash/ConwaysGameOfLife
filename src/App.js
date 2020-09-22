import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { makeInitialGrid } from "./utils.js";
import { updateGameOfLife, animateGameOfLife } from "./conwayUtils.js";
import constants from "./constants.js";

function App() {
  const [isGameRunning, setIsGameRunning] = useState(false);
  const canvasRef = useRef(null);
  const gridRef = useRef(makeInitialGrid());

  useEffect(() => {
    const grid = gridRef.current;
    const pencil = canvasRef.current.getContext("2d");

    if (!isGameRunning) {
      animateGameOfLife(grid, pencil, constants);
      return;
    }

    animateGameOfLife(grid, pencil, constants);
    const intervalId = setInterval(() => {
      updateGameOfLife(grid);
      animateGameOfLife(grid, pencil, constants);
    }, constants.CLOCK_MILLIS);

    return () => clearInterval(intervalId);
  }, [isGameRunning]);

  const onCanvasClick = evt => {
    evt.stopPropagation();
    const canvas = canvasRef.current;
    const grid = gridRef.current;

    const rect = canvas.getBoundingClientRect();
    const x = evt.nativeEvent.clientX - rect.left;
    const y = evt.nativeEvent.clientY - rect.top;

    const i = Math.floor(x / constants.CELL_SIZE);
    const j = Math.floor(y / constants.CELL_SIZE);

    if (i >= 0 && j >= 0 && i < grid.length && j < grid[0].length) {
      grid[i][j] = !grid[i][j];
    }
    animateGameOfLife(grid, canvas.getContext("2d"), constants);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>Conway's Game of Life</div>
        <canvas
          width={constants.CANVAS_WIDTH * constants.CELL_SIZE}
          height={constants.CANVAS_HEIGHT * constants.CELL_SIZE}
          ref={canvasRef}
          onClick={onCanvasClick}
        ></canvas>

        <div id="control-panel">
          <button type="button" onClick={() => setIsGameRunning(wasGameRunning => !wasGameRunning)}>
            {isGameRunning ? "stop" : "run"}
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
