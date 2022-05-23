import { Board } from './Board';
import { Tetrimino } from './Tetrimino';
export class Game {
  startPosition = 4;
  rotation = Math.floor(Math.random() * 4);

  UISelectors = {
    board: document.querySelector('[data-board]'),
  };

  eventListeners() {
    window.addEventListener('keydown', ({ keyCode }) => {
      if (this.stopMoving(10, 200) && keyCode === 40) {
        this.moveDown();
      }
      if (this.stopLeft(-1) && keyCode === 37) {
        this.moveLeft();
      }
      if (this.stopRight() && keyCode === 39) {
        this.moveRight();
      }
    });
  }

  start() {
    this.drawBoard(this.UISelectors.board);
    this.createTetrimino();
    this.eventListeners();
  }

  drawBoard(...params) {
    const board = new Board(...params);
    board.init();
  }

  createTetrimino() {
    const tetrimino = new Tetrimino();
    const createTetrimino = tetrimino.getRandomTetrimino();
    this.draw(createTetrimino[this.rotation], this.startPosition);
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

  control(x) {
    let position = this.activeTetriminosPosition();
    this.undraw(position);
    this.draw(position.map((el) => el + x));
  }

  stopMoving(checker, max) {
    let edge = this.activeTetriminosPosition().map((x) => x + checker);
    return !edge.some((x) => x >= max);
  }

  stopLeft() {
    let edge = this.activeTetriminosPosition();
    return !edge.some((x) => x % 10 === 0);
  }

  stopRight() {
    let edge = this.activeTetriminosPosition();
    return !edge.some((x) => x % 10 === 9);
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
}
