import getInput from './getInput.js'

let input = await getInput(20, '\n\n')

const directions = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3,
}

class Piece {
  constructor(data) {
    const [first, ...rest] = data.split('\n')
    this.id = parseInt(first.match(/Tile (\d+):/)[1])
    this.image = rest.map((row) => row.split(''))
  }

  // Get a unique id for an edge
  getEdge(direction) {
    const toDigit = (color) => (color === '#' ? '1' : '0')

    switch (direction) {
      case directions.top:
        return parseInt(this.image[0].map(toDigit).join(''), 2)
      case directions.right:
        return parseInt(this.image.map((row) => toDigit(row[row.length - 1])).join(''), 2)
      case directions.bottom:
        return parseInt(this.image[this.image.length - 1].map(toDigit).join(''), 2)
      case directions.left:
        return parseInt(this.image.map((row) => toDigit(row[0])).join(''), 2)
    }
  }

  rotate() {
    // Assumes square
    const result = []
    for (let i = 0; i < this.image.length; i++) {
      const row = []
      result.push(row)
      for (let j = 0; j < this.image.length; j++) {
        row.push(this.image[this.image.length - j - 1][i])
      }
    }
    this.image = result
  }

  flip() {
    this.image.reverse()
  }

  // Returns true if this piece can be rotated to match the inputs. If it is a match, the piece is rotated correctly
  matches(topEdge, rightEdge, bottomEdge, leftEdge) {
    // Try four rotations
    for (let i = 0; i < 4; i++) {
      if (this.isCurrentMatch(topEdge, rightEdge, bottomEdge, leftEdge)) return true
      this.rotate()
    }
    // Flip and try last four rotations
    this.flip()
    for (let i = 0; i < 4; i++) {
      if (this.isCurrentMatch(topEdge, rightEdge, bottomEdge, leftEdge)) return true
      this.rotate()
    }
    return false
  }

  isCurrentMatch(topEdge, rightEdge, bottomEdge, leftEdge) {
    if (topEdge && this.getEdge(directions.top) !== topEdge) return false
    if (rightEdge && this.getEdge(directions.right) !== rightEdge) return false
    if (bottomEdge && this.getEdge(directions.bottom) !== bottomEdge) return false
    if (leftEdge && this.getEdge(directions.left) !== leftEdge) return false
    return true
  }
}

const [firstPiece, ...otherPieces] = input.map((data) => new Piece(data))
const unplacedMap = otherPieces.reduce((acc, piece) => acc.set(piece.id, piece), new Map())

// Build an array will contained the placed pieces. Keep an outer edge of nulls.
const result = [
  [null, null, null],
  [null, firstPiece, null],
  [null, null, null],
]

while (unplacedMap.size > 0) {
  for (let row = 0; row < result.length; row++) {
    for (let col = 0; col < result[row].length; col++) {
      if (result[row][col] !== null) continue
      // Determine the edges needed for this spot
      let topEdge, rightEdge, bottomEdge, leftEdge
      if (row > 0 && result[row - 1][col] !== null) {
        topEdge = result[row - 1][col].getEdge(directions.bottom)
      }
      if (row < result.length - 1 && result[row + 1][col] !== null) {
        bottomEdge = result[row + 1][col].getEdge(directions.top)
      }
      if (col > 0 && result[row][col - 1] !== null) {
        leftEdge = result[row][col - 1].getEdge(directions.right)
      }
      if (col < result[row].length - 1 && result[row][col + 1] !== null) {
        rightEdge = result[row][col + 1].getEdge(directions.left)
      }
      if (topEdge === undefined && rightEdge === undefined && bottomEdge === undefined && leftEdge === undefined) {
        continue
      }
      // Find pieces that will work
      const matches = [...unplacedMap.values()].filter((piece) =>
        piece.matches(topEdge, rightEdge, bottomEdge, leftEdge)
      )
      if (matches.length === 1) {
        // Found a piece
        unplacedMap.delete(matches[0].id)
        result[row][col] = matches[0]
      }
    }
  }

  // Update the edges if we placed any pieces there
  if (result.some((row) => row[0])) {
    result.forEach((row) => row.unshift(null))
  }
  if (result.some((row) => row[row.length - 1])) {
    result.forEach((row) => row.push(null))
  }
  if (result[0].some((piece) => piece)) {
    result.unshift(result[0].map(() => null))
  }
  if (result[result.length - 1].some((piece) => piece)) {
    result.push(result[result.length - 1].map(() => null))
  }
}

const part1 =
  result[1][1].id *
  result[result.length - 2][1].id *
  result[1][result[1].length - 2].id *
  result[result.length - 2][result[result.length - 2].length - 2].id
console.log('Part 1', part1)
