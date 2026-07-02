// game/src/core/board.js
export class Board {
  constructor() {
    this.grid = Array.from({ length: 10 }, () => new Array(10).fill(0))
  }

  canPlace(piece, row, col) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (!piece[r][c]) continue
        const gr = row + r
        const gc = col + c
        if (gr < 0 || gr >= 10 || gc < 0 || gc >= 10) return false
        if (this.grid[gr][gc] !== 0) return false
      }
    }
    return true
  }

  place(piece, row, col) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece[r].length; c++) {
        if (piece[r][c]) {
          this.grid[row + r][col + c] = piece[r][c]
        }
      }
    }
  }

  clearFull() {
    const rowsToClear = []
    const colsToClear = []

    for (let r = 0; r < 10; r++) {
      if (this.grid[r].every(cell => cell !== 0)) rowsToClear.push(r)
    }

    for (let c = 0; c < 10; c++) {
      if (this.grid.every(row => row[c] !== 0)) colsToClear.push(c)
    }

    for (const r of rowsToClear) {
      this.grid[r].fill(0)
    }

    for (const c of colsToClear) {
      for (let r = 0; r < 10; r++) this.grid[r][c] = 0
    }

    return { clearedLines: rowsToClear.length, clearedCols: colsToClear.length }
  }

  hasRoom(piece) {
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (this.canPlace(piece, r, c)) return true
      }
    }
    return false
  }

  isGameOver(pieces) {
    return pieces.every(piece => !this.hasRoom(piece))
  }
}
