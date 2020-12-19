import getInput from './getInput.js'

let input = await getInput(18)

function tokenize(line) {
  return [...line, 'eol'].reduce((tokens, character) => {
    switch (character) {
      case ' ':
        return tokens
      case '*':
      case '+':
      case '(':
      case ')':
      case 'eol':
        return [...tokens, { type: character }]
      default:
        return [...tokens, { type: 'number', value: parseInt(character) }]
    }
  }, [])
}

// Part 1
function parse1(line) {
  const tokens = tokenize(line)
  let position = 0
  const result = expression()
  eat('eol')
  return result

  function eat(type) {
    if (tokens[position].type !== type) {
      throw new Error(`Expected ${type} but found ${tokens[position].type} at position ${position}`)
    }
    position++
  }

  function expression() {
    let currentToken = tokens[position]
    if (currentToken.type === '(' || currentToken.type === 'number') {
      return expressionPrime(term())
    }
    throw new Error(`Expected ( or number at position ${position}`)
  }

  function expressionPrime(previous) {
    let currentToken = tokens[position]
    switch (currentToken.type) {
      case '+':
        eat('+')
        return expressionPrime(previous + term())
      case '*':
        eat('*')
        return expressionPrime(previous * term())
      case ')':
      case 'eol':
        return previous
      default:
        throw new Error(`Unexpected token at position ${position}`)
    }
  }

  function term() {
    let currentToken = tokens[position]
    switch (currentToken.type) {
      case 'number':
        eat('number')
        return currentToken.value
      case '(':
        eat('(')
        const e = expression()
        eat(')')
        return e
      default:
        throw new Error(`Unexpected token at position ${position}`)
    }
  }
}

const part1 = input.reduce((sum, line) => sum + parse1(line), 0)
console.log('Part 1', part1)

// Part 2
function parse2(line) {
  const tokens = tokenize(line)
  let position = 0
  const result = expression()
  eat('eol')
  return result

  function eat(type) {
    if (tokens[position].type !== type) {
      throw new Error(`Expected ${type} but found ${tokens[position].type} at position ${position}`)
    }
    position++
  }

  function expression() {
    let currentToken = tokens[position]
    if (currentToken.type === '(' || currentToken.type === 'number') {
      return expressionPrime(term())
    }
    throw new Error(`Expected ( or number at position ${position}`)
  }

  function expressionPrime(previous) {
    let currentToken = tokens[position]
    switch (currentToken.type) {
      case '*':
        eat('*')
        return expressionPrime(previous * term())
      case ')':
      case 'eol':
        return previous
      default:
        throw new Error(`Unexpected token at position ${position}`)
    }
  }

  function term() {
    let currentToken = tokens[position]
    if (currentToken.type === '(' || currentToken.type === 'number') {
      return termPrime(factor())
    }
    throw new Error(`Expected ( or number at position ${position}`)
  }

  function termPrime(previous) {
    let currentToken = tokens[position]
    switch (currentToken.type) {
      case '+':
        eat('+')
        return termPrime(previous + factor())
      case ')':
      case '*':
      case 'eol':
        return previous
      default:
        throw new Error(`Unexpected token at position ${position}`)
    }
  }

  function factor() {
    let currentToken = tokens[position]
    switch (currentToken.type) {
      case 'number':
        eat('number')
        return currentToken.value
      case '(':
        eat('(')
        const e = expression()
        eat(')')
        return e
      default:
        throw new Error(`Unexpected token at position ${position}`)
    }
  }
}

const part2 = input.reduce((sum, line) => sum + parse2(line), 0)
console.log('Part 2', part2)
