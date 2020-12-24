import getInput from './getInput.js'

let input = await getInput(24)

function toDirections(line) {
  const result = []
  const iter = line[Symbol.iterator]()
  let curr = iter.next()
  while (!curr.done) {
    const first = curr.value
    if (first === 'e' || first === 'w') {
      result.push(first)
    } else {
      const second = iter.next().value
      result.push(`${first}${second}`)
    }
    curr = iter.next()
  }
  return result
}

function serialize(location) {
  return `${location.x};${location.y}`
}

function deserialize(value) {
  const [xString, yString] = value.split(';')
  return {
    x: parseInt(xString),
    y: parseInt(yString),
  }
}

const directionsList = input.map(toDirections)

// Part 1
let blackTiles = new Set()
for (const directions of directionsList) {
  const location = directions.reduce(
    (acc, direction) => {
      switch (direction) {
        case 'w':
          return { x: acc.x - 1, y: acc.y }
        case 'e':
          return { x: acc.x + 1, y: acc.y }
        case 'nw':
          return { x: acc.x, y: acc.y - 1 }
        case 'ne':
          return { x: acc.x + 1, y: acc.y - 1 }
        case 'sw':
          return { x: acc.x - 1, y: acc.y + 1 }
        case 'se':
          return { x: acc.x, y: acc.y + 1 }
      }
    },
    { x: 0, y: 0 }
  )

  const serialized = serialize(location)

  if (blackTiles.has(serialized)) {
    // Flip to white
    blackTiles.delete(serialized)
  } else {
    // Flip to black
    blackTiles.add(serialized)
  }
}

console.log('Part 1', blackTiles.size)

// Part 2
const adjacent = [
  { deltaX: -1, deltaY: 0 },
  { deltaX: 1, deltaY: 0 },
  { deltaX: 0, deltaY: -1 },
  { deltaX: 1, deltaY: -1 },
  { deltaX: -1, deltaY: 1 },
  { deltaX: 0, deltaY: 1 },
]

function adjacentBlackTileCount(location, blackTiles) {
  const toTest = adjacent.map((delta) => ({ x: location.x + delta.deltaX, y: location.y + delta.deltaY }))
  return toTest.map((location) => blackTiles.has(serialize(location))).filter(Boolean).length
}

function willBeBlack(location, blackTiles) {
  const count = adjacentBlackTileCount(location, blackTiles)
  if (blackTiles.has(serialize(location))) {
    return count === 1 || count === 2
  } else {
    return count === 2
  }
}

function doStep(blackTiles) {
  // May have duplicate locations, but it will be de-duped in the returned set
  const locations = [...blackTiles]
    .map(deserialize)
    .flatMap((location) => [
      location,
      ...adjacent.map((delta) => ({ x: location.x + delta.deltaX, y: location.y + delta.deltaY })),
    ])
  return new Set(locations.filter((location) => willBeBlack(location, blackTiles)).map(serialize))
}

for (let i = 1; i <= 100; i++) {
  blackTiles = doStep(blackTiles)
}

console.log('Part 2', blackTiles.size)
