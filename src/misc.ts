export const randomInArray = <T>(arr: T[]): T => {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

export const checkCollision = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return x1 == x2 && y1 == y2
}

export const manhattanDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}
