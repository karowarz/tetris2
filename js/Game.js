import { Board } from './Board';
import { Tetrimino } from './Tetrimino';
export class Game {
  startPosition = 4;
  currentShape = null;
  rotation = null;

  UISelectors = {
    board: document.querySelector('[data-board]'),
    start: document.querySelector('[data-start]'),
    resume: document.querySelector('[data-resume]'),
    stop: document.querySelector('[data-stop]'),
    showNext: document.querySelector('[data-next]'),
    finish: document.querySelector('[data-finish]'),
  };

  eventListeners({ start, resume, stop, finish }) {
    window.addEventListener('keydown', ({ keyCode }) => {
      if (this.shouldMove() && keyCode === 40) {
        this.moveDown();
      }
      if (this.stopLeft(-1) && !this.isOccupied(-1) && keyCode === 37) {
        this.moveLeft();
      }
      if (this.stopRight() && !this.isOccupied(1) && keyCode === 39) {
        this.moveRight();
      }
      if (
        this.shouldRotate() &&
        !this.isOccupied(1) &&
        !this.isOccupied(-1) &&
        keyCode === 38
      ) {
        this.rotate(this.prepareRotation());
      }
    });

    start.addEventListener('click', () => {
      this.creation();
      this.fallDown = setInterval(() => {
        this.moveDown();
      }, 1000);
      start.classList.toggle('clicked');
      stop.classList.toggle('clicked');
    });

    finish.addEventListener('click', () => {
      let active = this.activeTetriminosPosition();
      let occupied = [];
      this.currentShape = null;
      this.rotation = null;
      for (let el of document.querySelectorAll('[data-occupied]')) {
        occupied.push(+el.dataset.x);
        el.removeAttribute('data-occupied');
      }
      this.undraw(occupied);
      this.undraw(active);
      this.undrawNext();
      this.tetriminosContainer.length = 0;
      clearInterval(this.fallDown);

      finish.classList.toggle('clicked');
      start.classList.toggle('clicked');
      resume.classList.toggle('clicked');
    });

    resume.addEventListener('click', () => {
      this.fallDown = setInterval(() => {
        this.moveDown();
      }, 1000);

      resume.classList.toggle('clicked');
      stop.classList.toggle('clicked');
      finish.classList.toggle('clicked');
    });

    stop.addEventListener('click', () => {
      clearInterval(this.fallDown);
      stop.classList.toggle('clicked');
      resume.classList.toggle('clicked');
      finish.classList.toggle('clicked');
    });
  }

  start() {
    this.renderBoard(this.UISelectors);
    this.eventListeners(this.UISelectors);
  }

  renderBoard({ board }) {
    const gameBoard = new Board(board);
    gameBoard.init();
  }

  drawTetrimino() {
    const tetrimino = new Tetrimino();
    let rotation = Math.floor(Math.random() * 4);
    const drawTetrimino = tetrimino.getRandomTetrimino();
    rotation === 3 ? (rotation = 0) : rotation++;
    return [drawTetrimino, rotation];
  }

  //creates 2 tetriminos, current and next and push em to array
  tetriminosContainer = [];
  currentAndNextTetrimino() {
    this.tetriminosContainer.push(this.drawTetrimino());
    this.currentShape = this.tetriminosContainer[0][0];
    this.rotation = this.tetriminosContainer[0][1];
  }

  deletion() {
    this.undrawNext();
    this.tetriminosContainer.shift();
    this.currentAndNextTetrimino();
  }

  creation() {
    while (this.tetriminosContainer.length !== 2) {
      this.currentAndNextTetrimino();
    }
    this.draw(this.currentShape[this.rotation], this.startPosition);
    this.drawNext();
    this.prepareRotation();
  }

  activeTetrimino() {
    return [...document.querySelectorAll('[data-active]')];
  }

  activeTetriminosPosition() {
    let x = [];
    for (let el of this.activeTetrimino()) {
      x.push(+el.dataset.x);
    }
    return x;
  }

  rotatableTetrimino() {
    return [...document.querySelectorAll('[data-rotatable]')];
  }

  rotatableTetriminosPosition() {
    let x = [];
    for (let el of this.rotatableTetrimino()) {
      x.push(+el.dataset.x);
    }
    return x;
  }

  findRowToDelete() {
    let countOccupied = [];
    let occupiedCells = document.querySelectorAll('[data-occupied]');

    let row;

    for (let el of occupiedCells) {
      countOccupied.push(parseInt(el.dataset.x / 10));
    }

    //checks if any row has 10 'row values', that means its full occupied and ready to delete

    let map = countOccupied.reduce(
      (cnt, cur) => ((cnt[cur] = cnt[cur] + 1 || 1), cnt),
      {}
    );

    for (let [key, value] of Object.entries(map)) {
      if (value === 10) {
        return (row = key);
      }
    }
  }

  deleteRow(row) {
    if (row !== undefined) {
      let deletedRowValues = [];
      let valuesLessThanDeleted = [];

      for (let el = 0; el < 10; el++) {
        deletedRowValues.push(+(row + el));
      }

      for (let el of deletedRowValues) {
        document.querySelector(`[data-x="${el}"]`).removeAttribute('style');
        document
          .querySelector(`[data-x="${el}"]`)
          .removeAttribute('data-occupied');
      }
      for (let el of document.querySelectorAll('[data-occupied]')) {
        if (el.dataset.x < deletedRowValues[0] && el.dataset.x > 40) {
          valuesLessThanDeleted.push(+el.dataset.x);
        }
      }

      for (let el of valuesLessThanDeleted) {
        document.querySelector(`[data-x="${el}"]`).removeAttribute('style');
        document
          .querySelector(`[data-x="${el}"]`)
          .removeAttribute('data-occupied');
      }
      this.draw(valuesLessThanDeleted.map((el) => el + 10));
    }
  }

  undraw(positions) {
    for (let el of positions) {
      document.querySelector(`[data-x="${+el}"]`).removeAttribute('style');
      document
        .querySelector(`[data-x="${+el}"]`)
        .removeAttribute('data-active');

      document
        .querySelector(`[data-x="${+el}"]`)
        .removeAttribute('data-rotatable');
    }
  }
  draw(positions, shift = 0) {
    for (let el of positions) {
      document.querySelector(`[data-x="${+el + shift}"]`).dataset.active = '';
      document.querySelector(`[data-x="${+el + shift}"]`).dataset.rotatable =
        '';
      document.querySelector(
        `[data-x="${+el + shift}"]`
      ).style.backgroundColor = 'blue';
    }
  }

  drawNext() {
    for (let el of this.tetriminosContainer[1][0][
      this.tetriminosContainer[0][1]
    ]) {
      document.querySelector(`[data-tiles="${+el}"]`).style.backgroundColor =
        'green';
    }
  }

  undrawNext() {
    for (let el of this.tetriminosContainer[1][0][
      this.tetriminosContainer[0][1]
    ]) {
      document.querySelector(`[data-tiles="${+el}"]`).removeAttribute('style');
    }
  }

  shouldMove() {
    let edge = this.activeTetriminosPosition().map((x) => x + 10);
    return !edge.some((x) => x >= 200);
  }

  stopRotate() {
    if (!this.shouldRotate()) {
      for (let el of this.rotatableTetrimino()) {
        el.removeAttribute('data-rotatable');
      }
    }
  }

  shouldRotate() {
    let currentPositions = this.rotatableTetriminosPosition();
    let futureCondition = [];

    let futureValues = [];

    let futurePositions = this.currentShape[this.rotation];

    for (let i = 0; i < currentPositions.length; i++) {
      let result = currentPositions[i] - futurePositions[i];
      futureValues[i] = result;
    }
    for (let i = 0; i < currentPositions.length; i++) {
      futureCondition.push(futurePositions[i] + futureValues[0]);
    }

    if (currentPositions.some((x) => x % 10 === 7)) {
      if (futureCondition.some((x) => x % 10 === 0)) {
        return false;
      } else return true;
    } else if (currentPositions.some((x) => x % 10 === 8)) {
      if (futureCondition.some((x) => x % 10 === 0)) {
        return false;
      } else return true;
    } else if (currentPositions.some((x) => x % 10 === 9)) {
      if (futureCondition.some((x) => x % 10 === 0)) {
        return false;
      } else return true;
    } else if (currentPositions.some((x) => x % 10 === 0)) {
      if (futureCondition.some((x) => x % 10 === 9)) {
        return false;
      } else return true;
    } else return true;
  }

  isOccupied(value) {
    let active = this.activeTetriminosPosition();
    let condition = [];
    for (let el of active) {
      condition.push(
        document.querySelector(`[data-x="${+el + value}"]`).dataset.occupied ===
          ''
      );
    }
    return condition.some((x) => x === true);
  }

  stopLeft() {
    let edge = this.activeTetriminosPosition();
    return !edge.some((x) => x % 10 === 0);
  }

  stopRight() {
    let edge = this.activeTetriminosPosition();
    return !edge.some((x) => x % 10 === 9);
  }

  control(x) {
    let position = this.activeTetriminosPosition();
    this.undraw(position);
    this.draw(position.map((el) => el + x));
  }

  moveDown() {
    if (!this.shouldMove() || this.isOccupied(10)) {
      for (let el of this.activeTetrimino()) {
        el.removeAttribute('data-active');
        el.dataset.occupied = '';
        el.removeAttribute('data-rotatable');
      }

      this.deleteRow(this.findRowToDelete());
      this.deletion();
      setTimeout(() => {
        this.creation();
      }, 100);

      for (let el of this.activeTetrimino()) {
        el.removeAttribute('data-active');
        el.dataset.occupied = '';
        el.removeAttribute('data-rotatable');
      }
    } else {
      this.control(10);
    }
  }

  moveLeft() {
    this.control(-1);
  }
  moveRight() {
    this.control(1);
  }

  rotate([substractPositions, rotationValues]) {
    if (!this.shouldRotate()) {
      for (let el of this.rotatableTetrimino()) {
        el.removeAttribute('data-rotatable');
      }
    } else {
      let rotatablePosition = this.activeTetriminosPosition();
      if (rotationValues !== undefined) {
        this.undraw(rotatablePosition);
        this.draw(substractPositions, rotationValues);
      }
    }
  }

  prepareRotation() {
    let currentPositions = this.rotatableTetriminosPosition();
    let rotation = this.rotation;
    this.rotation === 3 ? (this.rotation = 0) : this.rotation++;
    let substractPositions = this.currentShape[rotation];

    let rotationValues = [];

    //values for moving them for value of base of tetrimino shape
    for (let i = 0; i < currentPositions.length; i++) {
      let result = currentPositions[i] - substractPositions[i];
      rotationValues[i] = result;
    }

    return [substractPositions, rotationValues[0]];
  }
}
