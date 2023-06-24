import {
  CANVAS_SIZE,
  CELL_SIZE,
  COORD,
  FOOD_SOUND,
  FPS,
  Motion,
  OFS,
  Point,
  ROW_COUNT,
  SNAKE_BODY_IMAGES,
  SNAKE_HEAD_BOTTOM,
  SNAKE_HEAD_LEFT,
  SNAKE_HEAD_RIGHT,
  SNAKE_HEAD_TOP,
  SNAKE_TAIL_BOTTOM,
  SNAKE_TAIL_LEFT,
  SNAKE_TAIL_RIGHT,
  SNAKE_TAIL_TOP,
} from './consts'
import { checkCollision } from './misc'
import { SnakeState } from './SnakeState'

export class SnakeCanvas {
  readonly onInputChanged: (c: string) => void
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  state: SnakeState

  constructor(state: SnakeState, onInputChanged: (c: string) => void) {
    this.onInputChanged = onInputChanged
    this.state = state

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    if (!canvas) {
      throw new Error('Canvas not found')
    }
    this.canvas = canvas

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas context not found')
    }
    this.ctx = ctx
  }

  onKeyDown = (evt: KeyboardEvent) => {
    this.onInputChanged(evt.key)
  }

  setupCanvas = () => {
    // makes canvas interactive upon load
    this.canvas.setAttribute('tabindex', '1')
    this.canvas.style.outline = 'none'
    this.canvas.focus()

    this.canvas.onkeydown = this.onKeyDown
  }

  newGame = () => {
    this.setupCanvas()
    this.ctx.beginPath()
    this.state.newGame()

    setInterval(() => this.game(), FPS)
  }

  drawSquare = (row: number, col: number, color: string) => {
    this.ctx.fillStyle = color
    this.ctx.fillRect(OFS(COORD(row)), OFS(COORD(col)), CELL_SIZE, CELL_SIZE)
  }

  drawArrows = () => {
    const snakeHead = this.state.head
    const food = this.state.food
    const snakeFillStyle = 'rgba(98,134,217,0.5)'
    this.drawHorizontalArrow(snakeHead.row, snakeFillStyle)
    this.drawVerticalArrow(snakeHead.col, snakeFillStyle)

    const foodFillStyle = 'rgba(217,98,136,0.5)'
    this.drawHorizontalArrow(food.row, foodFillStyle)
    this.drawVerticalArrow(food.col, foodFillStyle)
  }

  drawVerticalArrow = (col: number, fillStyle: string) => {
    const ctx = this.ctx
    const yOffset = OFS(0) - CELL_SIZE * 2
    ctx.fillStyle = fillStyle
    const colCoord = OFS(COORD(col))

    ctx.fillRect(colCoord, yOffset, CELL_SIZE, CELL_SIZE)

    ctx.beginPath()
    ctx.moveTo(colCoord, yOffset + CELL_SIZE)
    ctx.lineTo(colCoord + CELL_SIZE / 2, yOffset + CELL_SIZE + CELL_SIZE)
    ctx.lineTo(colCoord + CELL_SIZE, yOffset + CELL_SIZE)
    ctx.lineTo(colCoord, yOffset + CELL_SIZE)
    ctx.fill()
    ctx.closePath()
  }

  drawHorizontalArrow = (row: number, fillStyle: string) => {
    const ctx = this.ctx
    const xOffset = OFS(0) - CELL_SIZE * 2
    ctx.fillStyle = fillStyle

    const rowCoord = OFS(COORD(row))

    ctx.fillRect(xOffset, rowCoord, CELL_SIZE, CELL_SIZE)

    ctx.beginPath()
    ctx.moveTo(xOffset + CELL_SIZE, rowCoord)
    ctx.lineTo(xOffset + CELL_SIZE + CELL_SIZE, CELL_SIZE / 2 + rowCoord)
    ctx.lineTo(xOffset + CELL_SIZE, CELL_SIZE + rowCoord)
    ctx.lineTo(xOffset + CELL_SIZE, rowCoord)
    ctx.fill()
    ctx.closePath()
  }

  drawFood = () => {
    const food = this.state.food
    const head = this.state.head

    if (food.row === head.row) {
      this.ctx.globalAlpha = 0.4
    }
    this.drawImage(this.state.fruit, food.col, food.row)
    this.ctx.globalAlpha = 1
  }

  clearNonGameArea = (color1: string, color2: string) => {
    this.ctx.fillStyle = color1
    this.ctx.strokeStyle = color2
    this.ctx.fillRect(0, 0, OFS(0), CANVAS_SIZE)
    this.ctx.fillRect(0, 0, CANVAS_SIZE, OFS(0))
  }

  setBackground = (color1: string, color2: string) => {
    const [ctx, canvas] = [this.ctx, this.canvas]
    ctx.fillStyle = color1
    ctx.strokeStyle = color2

    ctx.fillRect(OFS(0), OFS(0), canvas.height, canvas.width)

    for (let x = 0.5; x < canvas.width; x += CELL_SIZE) {
      ctx.moveTo(OFS(x), OFS(0))
      ctx.lineTo(OFS(x), CANVAS_SIZE)
    }
    for (let y = 0.5; y < canvas.height; y += CELL_SIZE) {
      ctx.moveTo(OFS(0), OFS(y))
      ctx.lineTo(CANVAS_SIZE, OFS(y))
    }

    ctx.stroke()
  }

  drawImage = (img: HTMLImageElement, row: number, col: number) => {
    this.ctx.drawImage(img, OFS(COORD(row)), OFS(COORD(col)))
  }

  drawSnake = () => {
    const snake = this.state.snake

    for (let i = 0; i < this.state.snakeSize; i++) {
      let img: HTMLImageElement
      if (i > 0 && i < this.state.snakeSize - 1) {
        img = SNAKE_BODY_IMAGES[i % SNAKE_BODY_IMAGES.length]
        this.drawImage(img, snake[i].col, snake[i].row)
      }
    }

    const tail = this.state.tail
    const almostLast = snake[snake.length - 2]
    this.drawImage(tailImage(tail, almostLast), tail.col, tail.row)

    const head = this.state.head
    const second = snake[1]
    this.drawImage(headImage(head, second), head.col, head.row)
  }

  game = () => {
    const head = this.state.head
    const food = this.state.food
    // checking for wall collisions
    // if (head.x < 0 || head.x > canvas.width - CELL_SIZE || head.y < 0 || head.y > canvas.height - CELL_SIZE) {
    //     hit.play();
    //     setBackground();
    //     createSnake();
    //     drawSnake();
    //     createFood();
    //     drawFood();
    //     directionQueue = 'right';
    //     score = 0;
    // }

    // checking for colisions with SNAKE's body
    // for (i = 1; i < SNAKE.length; i++) {
    //     if (head.x == SNAKE[i].x && head.y == SNAKE[i].y) {
    //         hit.play(); // playing sounds
    //         setBackground();
    //         createSnake();
    //         drawSnake();
    //         createFood();
    //         drawFood();
    //         directionQueue = 'right';
    //         score = 0;
    //     }
    // }

    // checking for collision with FOOD
    if (checkCollision(head.col, head.row, food.col, food.row)) {
      this.state.appendLastTail()
      this.state.createFood()
      this.drawFood()
      this.state.changeSentences()
      FOOD_SOUND.play()
      // score += 10;
    }

    this.ctx.beginPath()
    this.setBackground('#fff', '#eee')
    this.drawSnake()
    this.drawFood()
    this.clearNonGameArea('#fff', '#eee')
    this.drawArrows()
    this.drawNumbers()
    this.drawWords()
  }

  drawWords = () => {
    const ctx = this.ctx
    const head = this.state.head
    const sentence = this.state.sentences[head.row]

    ctx.font = '14px verdana'
    ctx.fillStyle = 'black'

    const xOffset = OFS(0) + CELL_SIZE / 3
    const yOffset = OFS(COORD(head.row)) + CELL_SIZE / 1.6

    for (let i = 0; i < ROW_COUNT; i++) {
      const char = sentence[i]
      ctx.fillText(char, xOffset + i * CELL_SIZE, yOffset)
    }
  }

  drawNumbers = () => {
    const ctx = this.ctx
    const head = this.state.head

    ctx.font = '10px verdana'
    ctx.fillStyle = 'black'
    const xOffset = OFS(0) - CELL_SIZE * 1.8
    const yOffset = OFS(0) + CELL_SIZE / 2

    for (let i = 0; i < ROW_COUNT; i++) {
      let idx = 0
      if (i < head.row) {
        idx = head.row - i
      } else if (i === head.row) {
        idx = head.row
      } else {
        idx = i - head.row
      }
      ctx.fillText(`${idx}`, xOffset, yOffset + i * CELL_SIZE)
    }

    const horizXOffset = OFS(0) + CELL_SIZE / 5
    const horizYOffset = OFS(0) - CELL_SIZE * 1.3

    for (let i = 0; i < ROW_COUNT; i++) {
      let idx = 0
      if (i < head.col) {
        idx = head.col - i
      } else if (i === head.col) {
        idx = head.col
      } else {
        idx = i - head.col
      }
      ctx.fillText(`${idx}`, horizXOffset + i * CELL_SIZE, horizYOffset)
    }
  }
}

const headImage = (head: Point, before: Point) => {
  if (head.col > before.col) {
    return SNAKE_HEAD_RIGHT
  } else if (head.col < before.col) {
    return SNAKE_HEAD_LEFT
  } else if (head.row < before.row) {
    return SNAKE_HEAD_TOP
  } else {
    return SNAKE_HEAD_BOTTOM
  }
}

const tailImage = (tail: Point, after: Point) => {
  if (tail.col > after.col) {
    return SNAKE_TAIL_RIGHT
  } else if (tail.col < after.col) {
    return SNAKE_TAIL_LEFT
  } else if (tail.row < after.row) {
    return SNAKE_TAIL_TOP
  } else {
    return SNAKE_TAIL_BOTTOM
  }
}
