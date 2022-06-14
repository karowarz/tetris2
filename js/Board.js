export class Board {
  constructor(container) {
    this.container = container;
    this.board = [];
  }

  init() {
    this.createElement();
    this.drawBoard();
    this.rows();
  }

  createElement() {
    for (let row = 0; row < 20; row++) {
      this.board[row] = [];
      for (let col = 0; col < 10; col++) {
        const element = document.createElement('div');
        element.classList = 'boardCell';
        this.board[row].push(element);
      }
    }
  }

  drawBoard() {
    for (let [index, cell] of this.board.flat().entries()) {
      cell.dataset.x = index;
      cell.textContent = index
      this.container.appendChild(cell);
    }
  }

  rows() {
    for (let row = 0; row < 20; row++) {
      for (let cell of this.board[row]) {
        cell.dataset.row = row;
      }
    }
  }
}
