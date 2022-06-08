import { Board } from './Board';
import { Tetrimino } from './Tetrimino';
export class Game {
  startPosition = 4;

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
      if (
        this.shouldRotate() &&
        !this.isOccupied(1) &&
        !this.isOccupied(-1) &&
        keyCode === 38
      ) {
        this.rotate(this.prepareRotation());
      }
    });
  }

  start() {
    this.drawBoard(this.UISelectors.board);
    this.createTetrimino();
    this.eventListeners();
    this.checkPosition = setInterval(() => {
      this.stopMoving();
      this.stopRotate();
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
    this.rotate(this.prepareRotation());
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
      document.querySelector(
        `[data-x="${+el + shift}"]`
      ).style.backgroundColor = 'blue';
      document.querySelector(`[data-x="${+el + shift}"]`).dataset.active = '';
      document.querySelector(`[data-x="${+el + shift}"]`).dataset.rotatable =
        '';
    }
  }

  stopMoving() {
    if (!this.shouldMove() || this.isOccupied(10)) {
      for (let el of this.activeTetrimino()) {
        el.removeAttribute('data-active');
        el.dataset.occupied = '';
        el.removeAttribute('data-rotatable');
      }
      this.createTetrimino();
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
    this.control(10);
  }

  moveLeft() {
    this.control(-1);
  }
  moveRight() {
    this.control(1);
  }

  rotate([substractPositions, rotationValues]) {
    let rotatablePosition = this.activeTetriminosPosition();
    if (rotationValues !== undefined) {
      this.undraw(rotatablePosition);
      this.draw(substractPositions, rotationValues);
    }
  }

  prepareRotation() {
    let currentPositions = this.rotatableTetriminosPosition();
    let substractPositions = this.currentShape[this.rotation];

    let rotationValues = [];

    //values for moving them for value of base of tetrimino shape
    for (let i = 0; i < currentPositions.length; i++) {
      let result = currentPositions[i] - substractPositions[i];
      rotationValues[i] = result;
    }

    this.rotation === 3 ? (this.rotation = 0) : this.rotation++;
    console.log(substractPositions, rotationValues[0]);
    return [substractPositions, rotationValues[0]];
  }
}
