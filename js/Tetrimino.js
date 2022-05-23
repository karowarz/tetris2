export class Tetrimino {
  #ten = 10;

  #ITetrimino = [
    [1, this.#ten + 1, 2 * this.#ten + 1, 3 * this.#ten + 1],
    [this.#ten, this.#ten + 1, this.#ten + 2, this.#ten + 3],
    [1, this.#ten + 1, 2 * this.#ten + 1, 3 * this.#ten + 1],
    [this.#ten, this.#ten + 1, this.#ten + 2, this.#ten + 3],
  ];

  #TTetrimino = [
    [0, 1, 2, this.#ten + 1],
    [this.#ten, 1, this.#ten + 1, 2 * this.#ten + 1],
    [this.#ten, 1, this.#ten + 1, this.#ten + 2],
    [this.#ten + 1, 1, 2 * this.#ten + 1, this.#ten + 2],
  ];

  #OTetrimino = [
    [0, 1, this.#ten, this.#ten + 1],
    [0, 1, this.#ten, this.#ten + 1],
    [0, 1, this.#ten, this.#ten + 1],
    [0, 1, this.#ten, this.#ten + 1],
  ];

  #LTetrimino = [
    [1, this.#ten + 1, 2 * this.#ten + 1, 2 * this.#ten + 2],
    [this.#ten, this.#ten + 1, this.#ten + 2, 2 * this.#ten],
    [1, 2, this.#ten + 1, 2 * this.#ten + 1],
    [this.#ten, this.#ten + 1, this.#ten + 2, 2],
  ];

  #JTetrimino = [
    [1, this.#ten + 1, 2 * this.#ten + 1, 2 * this.#ten],
    [this.#ten, 2 * this.#ten, 2 * this.#ten + 1, 2 * this.#ten + 2],
    [1, 2, this.#ten + 1, 2 * this.#ten + 1],
    [this.#ten, this.#ten + 1, this.#ten + 2, 2 * this.#ten + 2],
  ];

  #STetrimino = [
    [this.#ten, 1, 2, this.#ten + 1],
    [0, this.#ten, this.#ten + 1, 2 * this.#ten + 1],
    [1, 2, this.#ten, this.#ten + 1],
    [1, this.#ten + 1, this.#ten + 2, 2 * this.#ten + 2],
  ];

  #ZTetrimino = [
    [0, 1, this.#ten + 1, this.#ten + 2],
    [1, this.#ten + 1, this.#ten, 2 * this.#ten],
    [0, 1, this.#ten + 1, this.#ten + 2],
    [2, this.#ten + 1, this.#ten + 2, 2 * this.#ten + 1],
  ];

  tetriminos = [
    this.#ITetrimino,
    this.#JTetrimino,
    this.#LTetrimino,
    this.#OTetrimino,
    this.#STetrimino,
    this.#TTetrimino,
    this.#ZTetrimino,
  ];

  getRandomTetrimino() {
    let randomShape = Math.floor(Math.random() * this.tetriminos.length);
    return this.tetriminos[randomShape];
  }
}
