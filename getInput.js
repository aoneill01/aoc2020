import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

export default async function getInput(day) {
  const response = await fetch(`https://adventofcode.com/2020/day/${day}/input`, {
    headers: {
      accept: 'text/html',
      cookie: process.env.COOKIE,
    },
    method: 'GET',
  })

  const text = await response.text()

  const lines = text.split('\n')
  return lines.slice(0, lines.length - 1)
}
