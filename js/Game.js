import { Board } from './Board';
import { Tetrimino } from './Tetrimino';
export class Game {
  startPosition = 4;
  rotation = null;
  checkPosition = null;
  currentShape = null;

  UISelectors = {
    board: document.querySelector('[data-board]'),
  };

  eventListeners() {
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
      if (keyCode === 38) {
        this.rotate();
      }
    });
  }

  start() {
    this.drawBoard(this.UISelectors.board);
    this.createTetrimino();
    this.eventListeners();
    this.checkPosition = setInterval(() => {
      this.stopMoving();
    }, 1);
  }

  drawBoard(...params) {
    const board = new Board(...params);
    board.init();
  }

  createTetrimino() {
    const tetrimino = new Tetrimino();
    this.rotation = Math.floor(Math.random() * 4);
    const createTetrimino = tetrimino.getRandomTetrimino();
    this.draw(createTetrimino[this.rotation], this.startPosition);
    this.currentShape = createTetrimino;
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

  undraw(positions) {
    for (let el of positions) {
      document.querySelector(`[data-x="${+el}"]`).style.backgroundColor = '';
      document
        .querySelector(`[data-x="${+el}"]`)
        .removeAttribute('data-active');
    }
  }
  draw(positions, shift = 0) {
    for (let el of positions) {
      document.querySelector(
        `[data-x="${+el + shift}"]`
      ).style.backgroundColor = 'blue';
      document.querySelector(`[data-x="${+el + shift}"]`).dataset.active = '';
    }
  }

  stopMoving() {
    if (!this.shouldMove() || this.isOccupied(10)) {
      for (let el of this.activeTetrimino()) {
        el.removeAttribute('data-active');
        el.dataset.occupied = '';
      }
      this.createTetrimino();
    }
  }

  shouldMove() {
    let edge = this.activeTetriminosPosition().map((x) => x + 10);
    return !edge.some((x) => x >= 200);
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
    this.control(10);
  }
  moveLeft() {
    this.control(-1);
  }
  moveRight() {
    this.control(1);
  }

  rotate() {
    let currentValues = this.activeTetriminosPosition();
    let substractPositions = this.currentShape[this.rotation];
    let substracted = [];

    for (let index = 0; index < currentValues.length; index++) {
      let result = currentValues[index] - substractPositions[index];
      substracted.push(result);
    }

    // console.log('c', currentValues);
    console.log('s', substracted);

    this.undraw(currentValues);
    this.draw(this.currentShape[this.rotation], substracted[0]);
    this.rotation === 3 ? (this.rotation = 0) : this.rotation++;
  }
}
