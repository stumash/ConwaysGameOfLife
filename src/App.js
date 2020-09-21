import React from "react";
import "./App.css";
import { makeMatrix } from "./utils.js";
import { updateGameOfLife, animateGameOfLife } from "./conwayUtils.js";
import constants from "./constants.js";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      CELL_SIZE: 10,
      CANVAS_WIDTH: 50,
      CANVAS_HEIGHT: 50,
      GAME_RUNNING: false,
      CLOCK_MILLIS: 500
    };

    this.clockID = undefined;
    this.canvasRef = React.createRef();
    this.grid = makeMatrix({
      dims: [this.state.CANVAS_WIDTH, this.state.CANVAS_HEIGHT],
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
      this.grid[i][j] = true;
    }
  }

  buttonText = () => {
    return this.state.GAME_RUNNING ? "stop" : "run";
  };
  toggleGameRunning = () => {
    const wasRunning = this.state.GAME_RUNNING;
    this.setState({
      ...this.state,
      GAME_RUNNING: !this.state.GAME_RUNNING
    });
    if (wasRunning) {
      clearInterval(this.clockID);
    } else {
      // start the game
      const c = this.canvasRef.current.getContext("2d");
      animateGameOfLife(this.grid, c, { ...this.state, ...constants });
      this.clockID = setInterval(() => {
        updateGameOfLife(this.grid);
        animateGameOfLife(this.grid, c, { ...this.state, ...constants });
      }, this.state.CLOCK_MILLIS);
    }
  };

  onCanvasClick = evt => {
    evt.stopPropagation();
    const rect = this.canvasRef.current.getBoundingClientRect();
    const x = evt.nativeEvent.clientX - rect.left;
    const y = evt.nativeEvent.clientY - rect.top;

    const i = Math.floor(x / this.state.CELL_SIZE);
    const j = Math.floor(y / this.state.CELL_SIZE);

    if (i >= 0 && j >= 0 && i < this.grid.length && j < this.grid[0].length) {
      this.grid[i][j] = !this.grid[i][j];
    }
    animateGameOfLife(this.grid, this.canvasRef.current.getContext("2d"), { ...this.state, ...constants });
  };

  render = () => (
    <div className="App">
      <header className="App-header">
        <div>Conway's Game of Life</div>
        <canvas
          width={this.state.CANVAS_WIDTH * this.state.CELL_SIZE}
          height={this.state.CANVAS_HEIGHT * this.state.CELL_SIZE}
          ref={this.canvasRef}
          onClick={this.onCanvasClick}
        ></canvas>

        <div id="control-panel">
          <button type="button" onClick={this.toggleGameRunning}>
            {this.buttonText()}
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
