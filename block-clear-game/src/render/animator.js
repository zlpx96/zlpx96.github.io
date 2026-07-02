// game/src/render/animator.js
import { CELL_SIZE, BOARD_PAD } from './renderer.js'

export class Animator {
  constructor(ctx) {
    this.ctx = ctx
    this.animations = []
  }

  triggerClear(clearedRowIndices, clearedColIndices) {
    if (clearedRowIndices.length === 0 && clearedColIndices.length === 0) return
    this.animations.push({
      rows: clearedRowIndices,
      cols: clearedColIndices,
      progress: 0,
      duration: 300,
    })
  }

  update(dt) {
    for (const anim of this.animations) {
      anim.progress += dt
    }
    this.animations = this.animations.filter(a => a.progress < a.duration)
    return this.animations.length > 0
  }

  draw() {
    for (const anim of this.animations) {
      const t = anim.progress / anim.duration
      const alpha = 1 - t

      this.ctx.save()
      this.ctx.globalAlpha = alpha * 0.7
      this.ctx.fillStyle = '#ffffff'

      for (const r of anim.rows) {
        this.ctx.fillRect(BOARD_PAD, BOARD_PAD + r * CELL_SIZE, CELL_SIZE * 10, CELL_SIZE)
      }
      for (const c of anim.cols) {
        this.ctx.fillRect(BOARD_PAD + c * CELL_SIZE, BOARD_PAD, CELL_SIZE, CELL_SIZE * 10)
      }
      this.ctx.restore()
    }
  }
}
