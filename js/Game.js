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
        // console.log(this.tab[1][0][this.tab[0][1]]);
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
      while (this.tab.length !== 2) {
        this.currentAndNextTetrimino();
      }
      this.draw(this.currentShape[this.rotation], this.startPosition);
      this.drawNext();
      this.prepareRotation();
      this.fallDown = setInterval(() => {
        this.moveDown();
      }, 1000);
      start.classList.toggle('clicked');
      stop.classList.toggle('clicked');
    });

    finish.addEventListener('click', () => {
      let active = this.activeTetriminosPosition();
      let occupied = [];
      for (let el of document.querySelectorAll('[data-occupied]')) {
        occupied.push(+el.dataset.x);
      }
      this.undraw(occupied);
      this.undraw(active);
      this.undrawNext();
      this.tab.length = 0;
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
    this.drawBoard(this.UISelectors);
    this.eventListeners(this.UISelectors);
  }

  drawBoard({ board }) {
    const gameBoard = new Board(board);
    gameBoard.init();
  }

  createTetrimino() {
    const tetrimino = new Tetrimino();
    let rotation = Math.floor(Math.random() * 4);
    const createTetrimino = tetrimino.getRandomTetrimino();
    rotation === 3 ? (rotation = 0) : rotation++;
    return [createTetrimino, rotation];
  }

  //creates 2 tetriminos, current and next and push em to array
  tab = [];
  currentAndNextTetrimino() {
    this.tab.push(this.createTetrimino());
    this.currentShape = this.tab[0][0];
    this.rotation = this.tab[0][1];
  }

  //ascync makes a pause before create new tetromino
  // async creation() {
  //   let promise = new Promise((resolve) =>
  //     setTimeout(() => {
  //       resolve(
  //         this.undrawNext(),
  //         this.tab.shift(),
  //         this.currentAndNextTetrimino(),
  //         this.draw(this.currentShape[this.rotation], this.startPosition),
  //         this.drawNext(),
  //         this.prepareRotation()
  //       );
  //     }, 100)
  //   );
  //   // let result = await promise;
  // }

  creation() {
    // let promise = new Promise((resolve) =>
    // setTimeout(() => {
    // resolve(
    this.undrawNext(),
      this.tab.shift(),
      this.currentAndNextTetrimino(),
      this.draw(this.currentShape[this.rotation], this.startPosition),
      this.drawNext(),
      this.prepareRotation();
    // );
    // }, 100)
    // );
    // let result = await promise;
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
        if (el.dataset.x < deletedRowValues[0]) {
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
  // deleteRow(row) {
  //   if (row !== undefined) {
  //     let tab = [];
  //     for (let cell = 0; cell < 10; cell++) {
  //       tab.push(+(row + cell));
  //     }
  //     for (let el of tab) {
  //       document
  //         .querySelector(`[data-x="${el}"]`)
  //         .removeAttribute('data-occupied');

  //       document.querySelector(`[data-x="${el}"]`).removeAttribute('style');
  //     }

  //     //takes the highest blocks and removes attribbutes and 'pull down' the rest of blocks with occupied data to delete row
  //     let pastOccupiedVal = [];
  //     let futureOccupiedVal = [];
  //     for (let el of document.querySelectorAll('[data-occupied]')) {
  //       pastOccupiedVal.push(+el.dataset.x);
  //       futureOccupiedVal.push(+el.dataset.x + 10);
  //     }

  //     for (let el of pastOccupiedVal) {
  //       document.querySelector(`[data-x="${el + 10}"]`).style.backgroundColor =
  //         'blue';

  //       document.querySelector(`[data-x="${el + 10}"]`).dataset.occupied = '';
  //     }

  //     let toDelete = pastOccupiedVal.filter(
  //       (el) => futureOccupiedVal.indexOf(el) === -1
  //     );

  //     for (let el of toDelete) {
  //       document.querySelector(`[data-x="${el}"]`).removeAttribute('style');
  //       document
  //         .querySelector(`[data-x="${el}"]`)
  //         .removeAttribute('data-occupied');
  //     }
  //   }
  // }

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

  drawNext() {
    for (let el of this.tab[1][0][this.tab[0][1]]) {
      document.querySelector(`[data-tiles="${+el}"]`).style.backgroundColor =
        'green';
    }
  }

  undrawNext() {
    for (let el of this.tab[1][0][this.tab[0][1]]) {
      document.querySelector(`[data-tiles="${+el}"]`).removeAttribute('style');
    }
  }

  // stopMoving() {
  //   if (!this.shouldMove() || this.isOccupied(10)) {
  //     for (let el of this.activeTetrimino()) {
  //       el.removeAttribute('data-active');
  //       el.dataset.occupied = '';
  //       el.removeAttribute('data-rotatable');
  //     }

  //     this.deleteRow(this.findRowToDelete());
  //     this.creation();
  //   }
  // }

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
      this.creation();
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
