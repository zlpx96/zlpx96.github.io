// game/src/core/piece.js
export const PIECES = [
  [[1]],
  [[1, 1]],
  [[1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 0], [1, 0], [1, 1]],
  [[0, 1], [0, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]],
  [[1, 1, 1, 1]],
  [[1, 1, 1], [1, 1, 1]],
  [[1], [1]],
  [[1], [1], [1]],
]

export const PIECE_COLORS = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c',
  '#3498db', '#9b59b6', '#e91e63', '#00bcd4', '#ff5722',
  '#8bc34a', '#ff9800', '#607d8b',
]

export function getRandomPieces() {
  const result = []
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * PIECES.length)
    result.push({
      shape: PIECES[idx],
      colorIndex: idx,
      color: PIECE_COLORS[idx],
    })
  }
  return result
}
