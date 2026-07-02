// game/src/ui/input.js
export class InputHandler {
  constructor(canvas, callbacks) {
    this.canvas = canvas
    this.callbacks = callbacks
    this.dragging = false

    canvas.addEventListener('mousedown', e => this._start(this._pos(e)))
    canvas.addEventListener('mousemove', e => this._move(this._pos(e)))
    canvas.addEventListener('mouseup', e => this._end(this._pos(e)))
    canvas.addEventListener('mouseleave', e => this._end(this._pos(e)))

    canvas.addEventListener('touchstart', e => { e.preventDefault(); this._start(this._touchPos(e)) }, { passive: false })
    canvas.addEventListener('touchmove', e => { e.preventDefault(); this._move(this._touchPos(e)) }, { passive: false })
    canvas.addEventListener('touchend', e => { e.preventDefault(); this._end(this._touchPos(e)) }, { passive: false })
  }

  _pos(e) {
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  _touchPos(e) {
    const touch = e.touches[0] || e.changedTouches[0]
    return this._pos(touch)
  }

  _start(pos) {
    this.dragging = true
    this.callbacks.onDragStart(pos)
  }

  _move(pos) {
    if (!this.dragging) return
    this.callbacks.onDragMove(pos)
  }

  _end(pos) {
    if (!this.dragging) return
    this.dragging = false
    this.callbacks.onDragEnd(pos)
  }
}
