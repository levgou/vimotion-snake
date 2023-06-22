import { Direction, Motion, Point, SENTENCE } from './consts'

const CANVAS_SIZE = 600
const CANVAS_PLAY_OFFSET = 100
const CANVAS_PLAY_SIZE = CANVAS_SIZE - CANVAS_PLAY_OFFSET

const CELL_SIZE = 20
const ROW_COUNT = (CANVAS_SIZE - CANVAS_PLAY_OFFSET) / CELL_SIZE
const SNAKE_COLOR = '#3498db'
const FOOD_COLOR = '#ff3636'
const FPS = 25
const SNAKE_LENGTH = 5

const OFS = (n: number) => n + CANVAS_PLAY_OFFSET
const COORD = (n: number) => n / CELL_SIZE

// todo: these should be in a state
let SNAKE: { x: number; y: number }[] = []
let FOOD = {
  x: 0,
  y: 0,
}
let FOOD_X: number[] = []
let FOOD_Y: number[] = []

export const setupCanvas = (
  onInputChanged: (head: Point, c: string) => Motion | null
) => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) {
    throw new Error('Canvas not found')
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas context not found')
  }

  // const scoreIs = document.getElementById('score')
  // const direction = ''
  // const directionQueue = ''
  // const score = 0
  // const hit = new Audio('hit.wav');
  // const pick = new Audio('pick.wav');

  // pushes possible x and y positions to separate arrays
  for (let i = OFS(0); i <= CANVAS_PLAY_SIZE - CELL_SIZE; i += CELL_SIZE) {
    FOOD_X.push(i)
    FOOD_Y.push(i)
  }

  // makes canvas interactive upon load
  canvas.setAttribute('tabindex', '1')
  canvas.style.outline = 'none'
  canvas.focus()

  canvas.onkeydown = (evt) => {
    const motion = onInputChanged(
      { x: COORD(SNAKE[0].x), y: COORD(SNAKE[0].y) },
      evt.key
    )
    if (motion) {
      moveSnake(motion)
    }
  }

  const board = {
    width: COORD(CANVAS_PLAY_SIZE),
    height: COORD(CANVAS_PLAY_SIZE),
  }

  return { canvas, ctx, board }
}

const drawSquare = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) => {
  ctx.fillStyle = color
  ctx.fillRect(OFS(x), OFS(y), CELL_SIZE, CELL_SIZE)
}

function createFood() {
  FOOD.x = FOOD_X[Math.floor(Math.random() * FOOD_X.length)]
  FOOD.y = FOOD_Y[Math.floor(Math.random() * FOOD_Y.length)]

  for (let i = 0; i < SNAKE.length; i++) {
    if (checkCollision(FOOD.x, FOOD.y, SNAKE[i].x, SNAKE[i].y)) {
      createFood()
    }
  }
}

const drawArrows = (ctx: CanvasRenderingContext2D) => {
  const snakeHead = SNAKE[0]
  const snakeFillStyle = 'rgba(98,134,217,0.5)'
  drawHorizontalArrow(ctx, OFS(snakeHead.y), snakeFillStyle)
  drawVerticalArrow(ctx, OFS(snakeHead.x), snakeFillStyle)

  const foodFillStyle = 'rgba(217,98,136,0.5)'
  drawHorizontalArrow(ctx, OFS(FOOD.y), foodFillStyle)
  drawVerticalArrow(ctx, OFS(FOOD.x), foodFillStyle)
}

const drawVerticalArrow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  fillStyle: string
) => {
  const yOffset = OFS(0) - CELL_SIZE * 2
  ctx.fillStyle = fillStyle

  ctx.fillRect(x, yOffset, CELL_SIZE, CELL_SIZE)

  ctx.beginPath()
  ctx.moveTo(x, yOffset + CELL_SIZE)
  ctx.lineTo(x + CELL_SIZE / 2, yOffset + CELL_SIZE + CELL_SIZE)
  ctx.lineTo(x + CELL_SIZE, yOffset + CELL_SIZE)
  ctx.lineTo(x, yOffset + CELL_SIZE)
  ctx.fill()
  ctx.closePath()
}

const drawHorizontalArrow = (
  ctx: CanvasRenderingContext2D,
  y: number,
  fillStyle: string
) => {
  const xOffset = OFS(0) - CELL_SIZE * 2
  ctx.fillStyle = fillStyle

  ctx.fillRect(xOffset, y, CELL_SIZE, CELL_SIZE)

  ctx.beginPath()
  ctx.moveTo(xOffset + CELL_SIZE, y)
  ctx.lineTo(xOffset + CELL_SIZE + CELL_SIZE, CELL_SIZE / 2 + y)
  ctx.lineTo(xOffset + CELL_SIZE, CELL_SIZE + y)
  ctx.lineTo(xOffset + CELL_SIZE, y)
  ctx.fill()
  ctx.closePath()
}

function drawFood(ctx: CanvasRenderingContext2D) {
  drawSquare(ctx, FOOD.x, FOOD.y, FOOD_COLOR)
}

const clearNonGameArea = (
  ctx: CanvasRenderingContext2D,
  color1: string,
  color2: string
) => {
  ctx.fillStyle = color1
  ctx.strokeStyle = color2
  ctx.fillRect(0, 0, OFS(0), CANVAS_SIZE)
  ctx.fillRect(0, 0, CANVAS_SIZE, OFS(0))
}

const setBackground = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  color1: string,
  color2: string
) => {
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

function createSnake() {
  SNAKE = []
  for (let i = SNAKE_LENGTH; i > 0; i--) {
    const k = i * CELL_SIZE
    SNAKE.push({ x: k, y: 0 })
  }
}

function drawSnake(ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < SNAKE.length; i++) {
    drawSquare(ctx, SNAKE[i].x, SNAKE[i].y, SNAKE_COLOR)
  }
}

const moveSnake = (motion: Motion) => {
  const { direction, count } = motion

  if (motion.count === 0) {
    return
  }

  let x = SNAKE[0].x
  let y = SNAKE[0].y
  const movement = CELL_SIZE

  if (direction === Direction.Right) {
    x += movement
  } else if (direction === Direction.Left) {
    x -= movement
  } else if (direction === Direction.Up) {
    y -= movement
  } else if (direction === Direction.Down) {
    y += movement
  }

  let tail = SNAKE.pop()
  if (!tail) {
    throw new Error('Snake tail not found')
  }

  tail.x = x
  tail.y = y
  SNAKE.unshift(tail)

  if (count > 1) {
    moveSnake({
      ...motion,
      count: count - 1,
    })
  }
}

const checkCollision = (x1: number, y1: number, x2: number, y2: number) => {
  return x1 == x2 && y1 == y2
}

const drawWords = (ctx: CanvasRenderingContext2D) => {
  const head = SNAKE[0]

  ctx.font = '12px verdana'
  ctx.fillStyle = 'black'

  const xOffset = OFS(0) + CELL_SIZE / 3
  const yOffset = OFS(head.y) + CELL_SIZE / 1.6

  for (let i = 0; i < ROW_COUNT; i++) {
    const char = SENTENCE[i]
    ctx.fillText(char, xOffset + i * CELL_SIZE, yOffset)
  }
}

const drawNumbers = (ctx: CanvasRenderingContext2D) => {
  const head = SNAKE[0]

  ctx.font = '10px verdana'
  ctx.fillStyle = 'black'
  const xOffset = OFS(0) - CELL_SIZE * 1.8
  const yOffset = OFS(0) + CELL_SIZE / 2

  for (let i = 0; i < ROW_COUNT; i++) {
    let idx = 0
    if (i < COORD(head.y)) {
      idx = COORD(head.y) - i
    } else if (i === COORD(head.y)) {
      idx = COORD(head.y)
    } else {
      idx = i - COORD(head.y)
    }
    ctx.fillText(`${idx}`, xOffset, yOffset + i * CELL_SIZE)
  }

  const horizXOffset = OFS(0) + CELL_SIZE / 5
  const horizYOffset = OFS(0) - CELL_SIZE * 1.3

  for (let i = 0; i < ROW_COUNT; i++) {
    let idx = 0
    if (i < COORD(head.x)) {
      idx = COORD(head.x) - i
    } else if (i === COORD(head.x)) {
      idx = COORD(head.x)
    } else {
      idx = i - COORD(head.x)
    }
    ctx.fillText(`${idx}`, horizXOffset + i * CELL_SIZE, horizYOffset)
  }
}

function game(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  let head = SNAKE[0]
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
  if (checkCollision(head.x, head.y, FOOD.x, FOOD.y)) {
    SNAKE[SNAKE.length] = { x: head.x, y: head.y }
    createFood()
    drawFood(ctx)
    // pick.play();
    // score += 10;
  }

  ctx.beginPath()
  setBackground(canvas, ctx, '#fff', '#eee')
  drawSnake(ctx)
  drawFood(ctx)
  clearNonGameArea(ctx, '#fff', '#eee')
  drawArrows(ctx)
  drawNumbers(ctx)
  drawWords(ctx)
}

export const newGame = (
  onInputChanged: (head: Point, c: string) => Motion | null
) => {
  const { canvas, ctx, board } = setupCanvas(onInputChanged)
  ctx.beginPath()
  createSnake()
  createFood()

  setInterval(() => game(canvas, ctx), FPS)

  return board
}
