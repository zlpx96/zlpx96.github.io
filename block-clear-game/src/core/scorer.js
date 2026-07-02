// game/src/core/scorer.js
export class Scorer {
  constructor() {
    this.score = 0
    this.bestScore = 0
  }

  addClear(clearedLines, clearedCols) {
    const total = clearedLines + clearedCols
    if (total === 0) return 0

    // Multiplier rules:
    // - both axes cleared AND at least one axis has >=2 → ×2
    // - only one axis cleared with >=2 → ×1.5
    // - everything else (total<=2 with single axis or cross with single each) → ×1
    const maxAxis = Math.max(clearedLines, clearedCols)
    const bothAxes = clearedLines > 0 && clearedCols > 0
    let multiplier = 1
    if (maxAxis >= 2 && bothAxes) multiplier = 2
    else if (maxAxis === 2) multiplier = 1.5
    else if (maxAxis >= 3) multiplier = 2

    const points = Math.round(total * 10 * multiplier)
    this.score += points
    if (this.score > this.bestScore) this.bestScore = this.score
    return points
  }

  reset() {
    this.score = 0
  }
}
