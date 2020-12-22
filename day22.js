import getInput from './getInput.js'

let [player1, player2] = (await getInput(22, '\n\n', false)).map(parseHand)

function parseHand(input) {
  const [player, ...cardList] = input.split('\n').filter(Boolean)
  return cardList.map((card) => parseInt(card))
}

while (player1.length > 0 && player2.length > 0) {
  const card1 = player1.shift()
  const card2 = player2.shift()
  if (card1 > card2) {
    player1.push(card1)
    player1.push(card2)
  } else {
    player2.push(card2)
    player2.push(card1)
  }
}

const winner = player1.length === 0 ? player2 : player1

const part1 = winner.reverse().reduce((acc, card, index) => acc + (index + 1) * card, 0)

console.log('Part 1', part1)
