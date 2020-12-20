import getInput from './getInput.js'

let input = await getInput(20, '\n\n')

const directions = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3,
}

class Tile {
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

  // Returns true if this tile can be rotated to match the inputs. If it is a match, the tile is rotated correctly
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

// Part 1
const [firstTile, ...otherTiles] = input.map((data) => new Tile(data))
const unplacedMap = otherTiles.reduce((acc, tile) => acc.set(tile.id, tile), new Map())

// Build an array will contained the placed tiles. Keep an outer edge of nulls.
const result = [
  [null, null, null],
  [null, firstTile, null],
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
      // Find tiles that will work
      const matches = [...unplacedMap.values()].filter((tile) => tile.matches(topEdge, rightEdge, bottomEdge, leftEdge))
      if (matches.length === 1) {
        // Found a tile
        unplacedMap.delete(matches[0].id)
        result[row][col] = matches[0]
      }
    }
  }

  // Update the edges if we placed any tiles there
  if (result.some((row) => row[0])) {
    result.forEach((row) => row.unshift(null))
  }
  if (result.some((row) => row[row.length - 1])) {
    result.forEach((row) => row.push(null))
  }
  if (result[0].some((tile) => tile)) {
    result.unshift(result[0].map(() => null))
  }
  if (result[result.length - 1].some((tile) => tile)) {
    result.push(result[result.length - 1].map(() => null))
  }
}

const part1 =
  result[1][1].id *
  result[result.length - 2][1].id *
  result[1][result[1].length - 2].id *
  result[result.length - 2][result[result.length - 2].length - 2].id
console.log('Part 1', part1)

// Part 2
const image = []
for (let tileRowIndex = 1; tileRowIndex < result.length - 1; tileRowIndex++) {
  const firstTile = result[tileRowIndex][1]
  for (let rowIndex = 1; rowIndex < firstTile.image.length - 1; rowIndex++) {
    const row = []
    image.push(row)
    for (let tileColIndex = 1; tileColIndex < result[tileRowIndex].length - 1; tileColIndex++) {
      const tile = result[tileRowIndex][tileColIndex]
      for (let colIndex = 1; colIndex < tile.image[rowIndex].length - 1; colIndex++) {
        row.push(tile.image[rowIndex][colIndex])
      }
    }
  }
}

// Convert to a tile for easy transformations
const sateliteTile = new Tile('Tile 42:\n' + image.map((row) => row.join('')).join('\n'))

const seaMonster = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `
  .split('\n')
  .map((row) => row.split(''))

// Find the correct orientation that has sea monsters
const rotateTransformation = (tile) => tile.rotate()
const flipTransformation = (tile) => tile.flip()
const transformations = [
  rotateTransformation,
  rotateTransformation,
  rotateTransformation,
  rotateTransformation,
  flipTransformation,
  rotateTransformation,
  rotateTransformation,
  rotateTransformation,
]
for (const transformation of transformations) {
  if (hasSeaMonster(sateliteTile)) {
    break
  }
  transformation(sateliteTile)
}

function hasSeaMonster(sateliteTile) {
  for (let row = 0; row < sateliteTile.image.length; row++) {
    for (let col = 0; col < sateliteTile.image[row].length; col++) {
      if (isSeaMonsterAt(row, col, sateliteTile)) {
        return true
      }
    }
  }
  return false
}

function isSeaMonsterAt(row, col, sateliteTile) {
  if (
    row + seaMonster.length >= sateliteTile.image.length ||
    col + seaMonster[0].length >= sateliteTile.image[0].length
  ) {
    return false
  }
  for (let rowDelta = 0; rowDelta < seaMonster.length; rowDelta++) {
    for (let colDelta = 0; colDelta < seaMonster[rowDelta].length; colDelta++) {
      if (seaMonster[rowDelta][colDelta] === '#' && sateliteTile.image[row + rowDelta][col + colDelta] === '.') {
        return false
      }
    }
  }
  return true
}

function markSeaMonsterAt(row, col, sateliteTile) {
  for (let rowDelta = 0; rowDelta < seaMonster.length; rowDelta++) {
    for (let colDelta = 0; colDelta < seaMonster[rowDelta].length; colDelta++) {
      if (seaMonster[rowDelta][colDelta] === '#' && sateliteTile.image[row + rowDelta][col + colDelta] !== '.') {
        sateliteTile.image[row + rowDelta][col + colDelta] = 'O'
      }
    }
  }
}

for (let row = 0; row < image.length; row++) {
  for (let col = 0; col < image[row].length; col++) {
    if (isSeaMonsterAt(row, col, sateliteTile)) {
      markSeaMonsterAt(row, col, sateliteTile)
    }
  }
}

const part2 = sateliteTile.image.flat().reduce((acc, cell) => acc + (cell === '#' ? 1 : 0), 0)
console.log('Part 2', part2)
