import { Board } from './core/board.js'
import { Scorer } from './core/scorer.js'
import { getRandomPieces } from './core/piece.js'
import { Renderer } from './render/renderer.js'
import { Animator } from './render/animator.js'
import { InputHandler } from './ui/input.js'
import { HUD } from './ui/hud.js'
import { AdManager } from './ad/ad-manager.js'

function getFullIndices(board) {
  const rows = []
  const cols = []
  for (let r = 0; r < 10; r++) {
    if (board.grid[r].every(c => c !== 0)) rows.push(r)
  }
  for (let c = 0; c < 10; c++) {
    if (board.grid.every(row => row[c] !== 0)) cols.push(c)
  }
  return { rows, cols }
}

export class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.board = new Board()
    this.scorer = new Scorer()
    this.renderer = new Renderer(canvas)
    this.animator = new Animator(canvas.getContext('2d'))
    this.hud = new HUD(canvas, canvas.getContext('2d'))
    this.adManager = new AdManager()

    this.trayPieces = getRandomPieces()
    this.state = 'playing'

    this.drag = {
      active: false,
      pieceIdx: -1,
      x: 0,
      y: 0,
      previewRow: -1,
      previewCol: -1,
      previewValid: false,
    }

    this.lastTime = 0

    new InputHandler(canvas, {
      onDragStart: pos => this._onDragStart(pos),
      onDragMove: pos => this._onDragMove(pos),
      onDragEnd: pos => this._onDragEnd(pos),
    })

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      this.hud.handleClick(x, y)
    })
  }

  start() {
    this.lastTime = performance.now()
    requestAnimationFrame(t => this._loop(t))
  }

  _loop(timestamp) {
    const dt = timestamp - this.lastTime
    this.lastTime = timestamp
    this.animator.update(dt)
    this._render()
    requestAnimationFrame(t => this._loop(t))
  }

  _render() {
    const { renderer, board, scorer, drag, trayPieces, animator, hud } = this
    renderer.clear()
    renderer.drawBoard(board)

    if (drag.active && drag.previewRow >= 0) {
      renderer.drawPreview(
        trayPieces[drag.pieceIdx],
        drag.previewRow,
        drag.previewCol,
        drag.previewValid
      )
    }

    animator.draw()
    renderer.drawTray(trayPieces, drag.active ? drag.pieceIdx : -1)
    renderer.drawHUD(scorer.score, scorer.bestScore)

    if (drag.active) {
      renderer.drawDragging(trayPieces[drag.pieceIdx], drag.x, drag.y)
    }

    if (this.state === 'gameover') {
      hud._draw()
    }
  }

  _onDragStart(pos) {
    if (this.state !== 'playing') return
    const idx = this.renderer.pixelToTrayIndex(pos.x, pos.y, this.canvas.width)
    if (idx < 0 || idx > 2 || !this.trayPieces[idx]) return
    this.drag.active = true
    this.drag.pieceIdx = idx
    this.drag.x = pos.x
    this.drag.y = pos.y
  }

  _onDragMove(pos) {
    if (!this.drag.active) return
    this.drag.x = pos.x
    this.drag.y = pos.y

    const piece = this.trayPieces[this.drag.pieceIdx]
    const { row, col } = this.renderer.pixelToCell(pos.x, pos.y, piece.shape)
    this.drag.previewRow = row
    this.drag.previewCol = col
    this.drag.previewValid = this.board.canPlace(piece.shape, row, col)
  }

  _onDragEnd(pos) {
    if (!this.drag.active) return
    const piece = this.trayPieces[this.drag.pieceIdx]
    const { row, col } = this.renderer.pixelToCell(pos.x, pos.y, piece.shape)

    if (this.board.canPlace(piece.shape, row, col)) {
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) {
            this.board.grid[row + r][col + c] = piece.color
          }
        }
      }

      const { rows, cols } = getFullIndices(this.board)
      this.animator.triggerClear(rows, cols)

      const { clearedLines, clearedCols } = this.board.clearFull()
      this.scorer.addClear(clearedLines, clearedCols)

      this.trayPieces[this.drag.pieceIdx] = null

      if (this.trayPieces.every(p => p === null)) {
        this.trayPieces = getRandomPieces()
      }

      const remaining = this.trayPieces.filter(p => p !== null)
      if (this.board.isGameOver(remaining)) {
        this._triggerGameOver()
      }
    }

    this.drag.active = false
    this.drag.pieceIdx = -1
    this.drag.previewRow = -1
  }

  _triggerGameOver() {
    this.state = 'gameover'
    const canUseAd = this.adManager.canShowAd()
    this.hud.showGameOver(
      this.scorer.score,
      this.scorer.bestScore,
      canUseAd ? () => this._onWatchAd() : null,
      () => this._restart()
    )
  }

  _onWatchAd() {
    this.adManager.showRewardedAd(
      () => {
        for (let r = 8; r < 10; r++) this.board.grid[r].fill(0)
        this.state = 'playing'
        this.hud.hide()
        if (this.trayPieces.every(p => p === null)) {
          this.trayPieces = getRandomPieces()
        }
      },
      () => {}
    )
  }

  _restart() {
    this.board = new Board()
    this.scorer.reset()
    this.trayPieces = getRandomPieces()
    this.adManager.resetRound()
    this.state = 'playing'
    this.hud.hide()
  }
}
