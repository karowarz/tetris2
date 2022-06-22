export class Tetrimino {
  #ten = 10;

  //The Tetrominoes
  jTetromino = [
    [1, this.#ten + 1, this.#ten * 2 + 1, 2],
    [this.#ten, this.#ten + 1, this.#ten + 2, this.#ten * 2 + 2],
    [1, this.#ten + 1, this.#ten * 2 + 1, this.#ten * 2],
    [this.#ten, this.#ten * 2, this.#ten * 2 + 1, this.#ten * 2 + 2],
  ];

  lTetromino = [
    [0, 1, this.#ten + 1, this.#ten * 2 + 1],
    [1, this.#ten + 1, this.#ten + 2, this.#ten + 3],
    [1, this.#ten + 1, 2 * this.#ten + 1, 2 * this.#ten + 2],
    [0, 1, 2, this.#ten],
  ];

  zTetromino = [
    [0, this.#ten, this.#ten + 1, this.#ten * 2 + 1],
    [this.#ten + 1, this.#ten + 2, this.#ten * 2, this.#ten * 2 + 1],
    [0, this.#ten, this.#ten + 1, this.#ten * 2 + 1],
    [this.#ten + 1, this.#ten + 2, this.#ten * 2, this.#ten * 2 + 1],
  ];

  sTetromino = [
    [this.#ten, this.#ten + 1, 2 * this.#ten + 1, 2 * this.#ten + 2],
    [2, this.#ten + 1, this.#ten + 2, 2 * this.#ten + 1],
    [this.#ten, this.#ten + 1, 2 * this.#ten + 1, 2 * this.#ten + 2],
    [2, this.#ten + 1, this.#ten + 2, 2 * this.#ten + 1],
  ];

  tTetromino = [
    [1, this.#ten, this.#ten + 1, this.#ten + 2],
    [1, this.#ten + 1, this.#ten + 2, this.#ten * 2 + 1],
    [this.#ten, this.#ten + 1, this.#ten + 2, this.#ten * 2 + 1],
    [1, this.#ten, this.#ten + 1, this.#ten * 2 + 1],
  ];

  oTetromino = [
    [0, 1, this.#ten, this.#ten + 1],
    [0, 1, this.#ten, this.#ten + 1],
    [0, 1, this.#ten, this.#ten + 1],
    [0, 1, this.#ten, this.#ten + 1],
  ];

  iTetromino = [
    [1, this.#ten + 1, this.#ten * 2 + 1, this.#ten * 3 + 1],
    [this.#ten, this.#ten + 1, this.#ten + 2, this.#ten + 3],
    [1, this.#ten + 1, this.#ten * 2 + 1, this.#ten * 3 + 1],
    [this.#ten, this.#ten + 1, this.#ten + 2, this.#ten + 3],
  ];

  tetriminos = [
    this.jTetromino,
    this.lTetromino,
    this.zTetromino,
    this.sTetromino,
    this.tTetromino,
    this.oTetromino,
    this.iTetromino,
  ];

  getRandomTetrimino() {
    let randomShape = Math.floor(Math.random() * this.tetriminos.length);
    return this.tetriminos[randomShape];
  }
}
