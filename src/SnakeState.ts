import {
  APPLE,
  Board,
  CHERRY,
  COORD,
  Direction,
  FOOD_SOUND,
  Motion,
  OFS,
  Point,
  randomSentence,
  SNAKE_LENGTH,
  STRAWBERRY,
  VERY_GOOD_VERY_NICE,
  WATERMELON,
} from './consts'
import { checkCollision, manhattanDistance, randomInArray } from './misc'
import { eatConfig, explode, winConfig } from './explode'

export class SnakeState {
  readonly rowCount: number
  readonly dumbScore: boolean
  readonly neededScore: number
  readonly foodSpawnLimit?:
    | ((board: Board, point: Point, sentences: string[]) => boolean)
    | undefined

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

  constructor(
    rowCount: number,
    dumbScore: boolean,
    foodSpawnLimit:
      | ((board: Board, point: Point, sentences: string[]) => boolean)
      | undefined,
    neededScore: number
  ) {
    this.rowCount = rowCount
    this.dumbScore = dumbScore
    this.foodSpawnLimit = foodSpawnLimit
    this.neededScore = neededScore
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
      if (
        this.foodSpawnLimit &&
        !this.foodSpawnLimit(this.board, this.food, this.sentences)
      ) {
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

  increaseScore = () => {
    if (this.dumbScore) {
      this.score += 1
    } else {
      this.score += Math.max(1, this.foodDistance - this.movesDoneForFood)
    }
  }

  moveSnake = (motion: Motion): [boolean, Promise<any> | undefined] => {
    this.doMoveSnake(motion)
    this.movesDoneForFood += 1
    if (
      checkCollision(this.head.col, this.head.row, this.food.col, this.food.row)
    ) {
      this.increaseScore()
      this.appendLastTail()
      this.changeSentences()

      if (this.score === this.neededScore) {
        explode(OFS(COORD(this.food.col)), OFS(COORD(this.food.row)), winConfig)
        const p = new Promise((resolve) => {
          VERY_GOOD_VERY_NICE.onended = resolve
        })
        VERY_GOOD_VERY_NICE.play()
        return [true, p]
      } else {
        explode(OFS(COORD(this.food.col)), OFS(COORD(this.food.row)), eatConfig)
        this.createFood()
        FOOD_SOUND.play()
      }
    }
    return [false, undefined]
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
