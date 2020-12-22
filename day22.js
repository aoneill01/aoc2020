import getInput from './getInput.js'

async function getPlayers() {
  return (await getInput(22, '\n\n', false)).map(parseHand)
}
function parseHand(input) {
  const [player, ...cardList] = input.split('\n').filter(Boolean)
  return cardList.map((card) => parseInt(card))
}

function score(player1, player2) {
  const winner = player1.length === 0 ? player2 : player1
  return winner.reverse().reduce((acc, card, index) => acc + (index + 1) * card, 0)
}

// Part 1
const [part1Player1, part1Player2] = await getPlayers()

while (part1Player1.length > 0 && part1Player2.length > 0) {
  const card1 = part1Player1.shift()
  const card2 = part1Player2.shift()
  if (card1 > card2) {
    part1Player1.push(card1)
    part1Player1.push(card2)
  } else {
    part1Player2.push(card2)
    part1Player2.push(card1)
  }
}

console.log('Part 1', score(part1Player1, part1Player2))

// Part 2
function serializeHand(player1, player2) {
  return `${player1.join(',')}:${player2.join(',')}`
}

function playGame(player1, player2) {
  const playedHands = new Set()
  while (player1.length > 0 && player2.length > 0) {
    const serialized = serializeHand(player1, player2)
    if (playedHands.has(serialized)) {
      return true
    }
    playedHands.add(serialized)
    playRound(player1, player2)
  }
  return player1.length !== 0
}

function playRound(player1, player2) {
  const card1 = player1.shift()
  const card2 = player2.shift()

  if (player1WonRound(card1, card2, player1, player2)) {
    player1.push(card1)
    player1.push(card2)
  } else {
    player2.push(card2)
    player2.push(card1)
  }
}

function player1WonRound(card1, card2, player1, player2) {
  if (player1.length >= card1 && player2.length >= card2) {
    return playGame(player1.slice(0, card1), player2.slice(0, card2))
  }
  return card1 > card2
}

const [part2Player1, part2Player2] = await getPlayers()
playGame(part2Player1, part2Player2)
console.log('Part 2', score(part2Player1, part2Player2))
