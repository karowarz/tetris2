export class Board {
  constructor(container) {
    this.container = container;
    this.board = [];
  }

  init() {
    this.createElement();
    this.drawBoard();
  }

  createElement() {
    for (let row = 0; row < 20; row++) {
      this.board[row] = [];
      for (let col = 0; col < 10; col++) {
        const element = document.createElement('div');
        element.classList = 'boardCell';
        // element.dataset.x = row;
        // element.dataset.y = col;
        this.board[row].push(element);
      }
    }
  }
  drawBoard() {
    for (let [index, cell] of this.board.flat().entries()) {
      cell.dataset.x = index;
      this.container.appendChild(cell);
    }
  }
}
