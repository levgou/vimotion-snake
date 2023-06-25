import {
  APPLE,
  Board,
  CHERRY,
  Direction,
  FOOD_SOUND,
  Motion,
  randomSentence,
  SNAKE_LENGTH,
  STRAWBERRY,
  WATERMELON,
} from './consts'
import { checkCollision, manhattanDistance, randomInArray } from './misc'

export class SnakeState {
  readonly rowCount: number
  sentences: string[] = []
  fruit = APPLE

  lastTail = { col: 0, row: 0 }
  snake: { col: number; row: number }[] = []

  food = {
    col: 0,
    row: 0,
  }
  foodDistance = 0
  movesDoneForFood = 0

  score = 0

  constructor(rowCount: number) {
    this.rowCount = rowCount
    this.changeSentences()
  }

  get head() {
    return this.snake[0]
  }

  get tail() {
    return this.snake[this.snake.length - 1]
  }

  get snakeSize() {
    return this.snake.length
  }

  get headSentence() {
    return this.sentences[this.head.row]
  }

  get board(): Board {
    return {
      width: this.rowCount,
      height: this.rowCount,
    }
  }

  newGame = () => {
    this.createSnake()
    this.createFood()
  }

  changeSentences = () => {
    this.sentences = Array(this.rowCount).fill(0).map(randomSentence)
    return this.sentences
  }

  changeFruit = () => {
    this.fruit = randomInArray([APPLE, CHERRY, WATERMELON, STRAWBERRY])
  }

  randomCell = () => {
    return {
      col: Math.floor(Math.random() * this.rowCount),
      row: Math.floor(Math.random() * this.rowCount),
    }
  }

  randomizeFood = () => {
    this.food = this.randomCell()
    return this.food
  }

  createFood = () => {
    this.randomizeFood()

    for (let { col, row } of this.snake) {
      if (checkCollision(this.food.col, this.food.row, col, row)) {
        this.createFood()
      }
    }

    this.foodDistance = manhattanDistance(
      this.head.col,
      this.head.row,
      this.food.col,
      this.food.row
    )
    this.movesDoneForFood = 0
    this.changeFruit()
  }

  createSnake = () => {
    this.snake = []
    for (let i = SNAKE_LENGTH; i > 0; i--) {
      this.snake.push({ col: i, row: 0 })
    }
  }

  moveSnake = (motion: Motion) => {
    this.doMoveSnake(motion)
    this.movesDoneForFood += 1
    if (
      checkCollision(this.head.col, this.head.row, this.food.col, this.food.row)
    ) {
      this.score += Math.max(1, this.foodDistance - this.movesDoneForFood)
      this.appendLastTail()
      this.createFood()
      this.changeSentences()
      FOOD_SOUND.play()
    }
  }

  doMoveSnake = (motion: Motion) => {
    const { direction, count } = motion

    if (motion.count === 0) {
      return
    }

    let x = this.snake[0].col
    let y = this.snake[0].row

    if (direction === Direction.Right) {
      x += 1
    } else if (direction === Direction.Left) {
      x -= 1
    } else if (direction === Direction.Up) {
      y -= 1
    } else if (direction === Direction.Down) {
      y += 1
    }

    let tail = this.snake.pop()

    if (!tail) {
      throw new Error('Snake tail not found')
    }
    this.lastTail = { ...tail }

    tail.col = x
    tail.row = y
    this.snake.unshift(tail)

    if (count > 1) {
      this.doMoveSnake({
        ...motion,
        count: count - 1,
      })
    }
  }

  appendLastTail = () => {
    this.snake.push(this.lastTail)
  }
}
