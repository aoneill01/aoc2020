import getInput from './getInput.js'

let input = await getInput(17)

const serializeLocation = ({ x, y, z }) => `${x},${y},${z}`

const range = [-1, 0, 1]
const neighbors = range
  .flatMap((x) => range.flatMap((y) => range.map((z) => ({ x, y, z }))))
  .filter(({ x, y, z }) => x !== 0 || y !== 0 || z !== 0)

const startSpace = new Map()
for (const y in input) {
  for (const x in input[y]) {
    if (input[y][x] === '#') {
      const location = { x: +x, y: +y, z: 0 }
      startSpace.set(serializeLocation(location), location)
    }
  }
}

function isActive(location, space) {
  const neighborCount = countNeighbors(location, space)

  if (space.has(serializeLocation(location))) {
    return neighborCount === 2 || neighborCount === 3
  } else {
    return neighborCount === 3
  }
}

function countNeighbors(location, space) {
  return neighbors.map((neighbor) => space.has(serializeLocation(addDelta(location, neighbor)))).filter(Boolean).length
}

function addDelta(location, delta) {
  return { x: location.x + delta.x, y: location.y + delta.y, z: location.z + delta.z }
}

function step(space) {
  const result = new Map()
  for (const location of space.values()) {
    if (isActive(location, space)) {
      result.set(serializeLocation(location), location)
    }
    for (const surround of neighbors.map((neighbor) => addDelta(location, neighbor))) {
      if (isActive(surround, space)) {
        result.set(serializeLocation(surround), surround)
      }
    }
  }
  return result
}

let space = startSpace
for (let i = 0; i < 6; i++) {
  space = step(space)
}
console.log('Part 1', space.size)
