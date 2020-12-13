import getInput from './getInput.js'

const input = (await getInput(12)).map((line) => ({ action: line[0], value: +line.substring(1) }))
const directions = {
  N: { east: 0, north: 1 },
  E: { east: 1, north: 0 },
  S: { east: 0, north: -1 },
  W: { east: -1, north: 0 },
}

directions.N.right = directions.E
directions.N.left = directions.W
directions.E.right = directions.S
directions.E.left = directions.N
directions.S.right = directions.W
directions.S.left = directions.E
directions.W.right = directions.N
directions.W.left = directions.S

// Part 1
function processCommand1(command, ship) {
  switch (command.action) {
    case 'N':
    case 'E':
    case 'S':
    case 'W':
      ship.position.east += command.value * directions[command.action].east
      ship.position.north += command.value * directions[command.action].north
      break
    case 'F':
      ship.position.east += command.value * ship.direction.east
      ship.position.north += command.value * ship.direction.north
      break
    case 'R':
      for (let i = 0; i < command.value; i += 90) {
        ship.direction = ship.direction.right
      }
      break
    case 'L':
      for (let i = 0; i < command.value; i += 90) {
        ship.direction = ship.direction.left
      }
      break
  }
}

let ship = {
  position: { east: 0, north: 0 },
  direction: directions.E,
}

input.forEach((command) => processCommand1(command, ship))
console.log('Part 1', Math.abs(ship.position.east) + Math.abs(ship.position.north))

// Part 2
function processCommand2(command, ship) {
  switch (command.action) {
    case 'N':
    case 'E':
    case 'S':
    case 'W':
      ship.waypoint.position.east += command.value * directions[command.action].east
      ship.waypoint.position.north += command.value * directions[command.action].north
      break
    case 'F':
      ship.position.east += command.value * ship.waypoint.position.east
      ship.position.north += command.value * ship.waypoint.position.north
      break
    case 'R':
      for (let i = 0; i < command.value; i += 90) {
        const tmpEast = ship.waypoint.position.east
        ship.waypoint.position.east = ship.waypoint.position.north
        ship.waypoint.position.north = -tmpEast
      }
      break
    case 'L':
      for (let i = 0; i < command.value; i += 90) {
        const tmpEast = ship.waypoint.position.east
        ship.waypoint.position.east = -ship.waypoint.position.north
        ship.waypoint.position.north = tmpEast
      }
      break
  }
}

ship = {
  position: { east: 0, north: 0 },
  waypoint: {
    position: { east: 10, north: 1 },
  },
}

input.forEach((command) => processCommand2(command, ship))
console.log('Part 2', Math.abs(ship.position.east) + Math.abs(ship.position.north))
