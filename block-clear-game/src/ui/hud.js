// game/src/ui/hud.js
export class HUD {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
    this.visible = false
    this.callbacks = {}
    this._adBtnRect = null
    this._restartY = 0
  }

  showGameOver(score, bestScore, onWatchAd, onRestart) {
    this.visible = true
    this.score = score
    this.bestScore = bestScore
    this.callbacks = { onWatchAd, onRestart }
    this._draw()
  }

  hide() {
    this.visible = false
  }

  _draw() {
    const { ctx, canvas } = this
    const w = canvas.width
    const h = canvas.height

    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, 0, w, h)

    const boxW = 280, boxH = this.callbacks.onWatchAd ? 240 : 200
    const bx = (w - boxW) / 2, by = (h - boxH) / 2
    ctx.fillStyle = '#16213e'
    ctx.beginPath()
    ctx.roundRect(bx, by, boxW, boxH, 16)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('游戏结束', w / 2, by + 48)

    ctx.font = '18px sans-serif'
    ctx.fillStyle = '#aaaacc'
    ctx.fillText(`得分: ${this.score}`, w / 2, by + 85)
    ctx.fillText(`最高: ${this.bestScore}`, w / 2, by + 112)

    if (this.callbacks.onWatchAd) {
      const btnW = 220, btnH = 44
      const btnX = (w - btnW) / 2
      ctx.fillStyle = '#e74c3c'
      ctx.beginPath()
      ctx.roundRect(btnX, by + 136, btnW, btnH, 10)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 17px sans-serif'
      ctx.fillText('看广告继续', w / 2, by + 165)
      this._adBtnRect = { x: btnX, y: by + 136, w: btnW, h: btnH }
      this._restartY = by + 196
    } else {
      this._adBtnRect = null
      this._restartY = by + 156
    }

    ctx.fillStyle = '#8888aa'
    ctx.font = '14px sans-serif'
    ctx.fillText('放弃，重新开始', w / 2, this._restartY + 14)
  }

  handleClick(x, y) {
    if (!this.visible) return false
    if (this._adBtnRect) {
      const r = this._adBtnRect
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        this.callbacks.onWatchAd && this.callbacks.onWatchAd()
        return true
      }
    }
    if (y >= this._restartY && y <= this._restartY + 28) {
      this.callbacks.onRestart && this.callbacks.onRestart()
      return true
    }
    return false
  }
}
