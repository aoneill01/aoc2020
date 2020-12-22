import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

export default async function getInput(day, separator = '\n') {
  const response = await fetch(`https://adventofcode.com/2020/day/${day}/input`, {
    headers: {
      accept: 'text/html',
      cookie: process.env.COOKIE,
    },
    method: 'GET',
  })

  const text = await response.text()

  const lines = text.split(separator)
  return lines[lines.length - 1] === '' ? lines.slice(0, lines.length - 1) : lines
}
