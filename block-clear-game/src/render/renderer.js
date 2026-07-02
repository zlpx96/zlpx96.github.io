// game/src/render/renderer.js

const COLORS = {
  bg: '#1a1a2e',
  grid: '#2a2a4a',
  highlight: 'rgba(255,255,255,0.15)',
  invalid: 'rgba(255,50,50,0.3)',
  text: '#ffffff',
  textDim: '#8888aa',
}

const CELL = 36
const PAD = 12

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  clear() {
    const { ctx, canvas } = this
    ctx.fillStyle = COLORS.bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  drawBoard(board) {
    const { ctx } = this
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const x = PAD + c * CELL
        const y = PAD + r * CELL
        if (board.grid[r][c]) {
          ctx.fillStyle = board.grid[r][c]
          ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2)
        } else {
          ctx.fillStyle = COLORS.grid
          ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2)
        }
      }
    }
  }

  drawPreview(piece, row, col, valid) {
    const { ctx } = this
    ctx.fillStyle = valid ? COLORS.highlight : COLORS.invalid
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue
        const x = PAD + (col + c) * CELL
        const y = PAD + (row + r) * CELL
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2)
      }
    }
  }

  drawTray(pieces, draggingIdx) {
    const { ctx, canvas } = this
    const trayY = PAD + 10 * CELL + 20
    const slotW = canvas.width / 3

    pieces.forEach((piece, i) => {
      if (i === draggingIdx) return
      if (!piece) return

      const offsetX = i * slotW + slotW / 2
      const pieceW = piece.shape[0].length * CELL
      const startX = offsetX - pieceW / 2
      const startY = trayY

      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (!piece.shape[r][c]) continue
          ctx.fillStyle = piece.color
          ctx.fillRect(startX + c * CELL + 1, startY + r * CELL + 1, CELL - 2, CELL - 2)
        }
      }
    })
  }

  drawDragging(piece, x, y) {
    const { ctx } = this
    const offsetX = x - (piece.shape[0].length * CELL) / 2
    const offsetY = y - (piece.shape.length * CELL) / 2
    ctx.globalAlpha = 0.85
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue
        ctx.fillStyle = piece.color
        ctx.fillRect(offsetX + c * CELL + 1, offsetY + r * CELL + 1, CELL - 2, CELL - 2)
      }
    }
    ctx.globalAlpha = 1
  }

  drawHUD(score, bestScore) {
    const { ctx, canvas } = this
    ctx.fillStyle = COLORS.text
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`分数: ${score}`, PAD, canvas.height - 16)
    ctx.textAlign = 'right'
    ctx.fillStyle = COLORS.textDim
    ctx.font = '16px sans-serif'
    ctx.fillText(`最高: ${bestScore}`, canvas.width - PAD, canvas.height - 16)
  }

  pixelToCell(px, py, pieceShape) {
    const col = Math.floor((px - PAD - (pieceShape[0].length * CELL) / 2) / CELL)
    const row = Math.floor((py - PAD - (pieceShape.length * CELL) / 2) / CELL)
    return { row, col }
  }

  pixelToTrayIndex(px, py, canvasWidth) {
    const trayY = PAD + 10 * CELL + 20
    if (py < trayY) return -1
    return Math.floor(px / (canvasWidth / 3))
  }

  getBoardRect() {
    return { x: PAD, y: PAD, size: CELL * 10 }
  }
}

export const CELL_SIZE = CELL
export const BOARD_PAD = PAD
