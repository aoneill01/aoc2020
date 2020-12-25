import getInput from './getInput.js'

const [cardPublicKey, doorPublicKey] = (await getInput(25)).map((value) => parseInt(value))

const divisor = 20201227

function findLoopSize(publicKey) {
  let value = 1
  let loopCount = 0
  const subjectNumber = 7
  while (value !== publicKey) {
    loopCount++
    value *= subjectNumber
    value %= divisor
  }
  return loopCount
}

function calculateEncryptionKey(publicKey, loopSize) {
  let encryptionKey = 1

  for (let loop = 0; loop < loopSize; loop++) {
    encryptionKey *= publicKey
    encryptionKey %= divisor
  }

  return encryptionKey
}

const cardLoopSize = findLoopSize(cardPublicKey)
// const doorLoopSize = findLoopSize(doorPublicKey)
// const cardEncryptionKey = calculateEncryptionKey(cardPublicKey, doorLoopSize)
const doorEncryptionKey = calculateEncryptionKey(doorPublicKey, cardLoopSize)
console.log('Part 1', doorEncryptionKey)
