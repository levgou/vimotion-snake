import { createSignal, onMount } from 'solid-js'
import { SnakeState } from './SnakeState'
import { Board, IGNORE_INPUTS, Motion, Point, ROW_COUNT } from './consts'
import { SnakeCanvas } from './snake'
import { generateMotion } from './motion'
import { explode } from './explode'

export const useGame = ({
  hideNumbers,
  hideSentences,
  dumbScore,
  foodSpawnLimit,
  neededScore,
}: {
  hideSentences?: boolean
  hideNumbers?: boolean
  dumbScore?: boolean
  foodSpawnLimit?: (board: Board, point: Point, sentences: string[]) => boolean
  neededScore?: number
} = {}) => {
  const [userInput, setUserInput] = createSignal('')
  const [score, setScore] = createSignal(0)
  const [gameOver, setGameOver] = createSignal(false)

  const state = new SnakeState(
    ROW_COUNT,
    !!dumbScore,
    foodSpawnLimit,
    neededScore ?? -1
  )

  let lastMotion: Motion | null = null
  let canvas: SnakeCanvas

  onMount(() => {
    canvas = new SnakeCanvas(state, onInput, !!hideNumbers, !!hideSentences)
    canvas.newGame()
  })

  const onInput = (c: string) => {
    if (lastMotion) {
      setUserInput('')
    }

    if (c === 'Escape') {
      setUserInput('')
    } else if (IGNORE_INPUTS.some((i) => c.startsWith(i))) {
    } else {
      setUserInput(userInput() + c)
    }

    const motion = generateMotion(
      state.board,
      state.head,
      state.headSentence,
      lastMotion,
      userInput()
    )
    if (!motion?.ignoreSave) {
      lastMotion = motion
    }
    if (motion) {
      const [gameOver, p] = state.moveSnake(motion)
      if (gameOver) {
        p?.then(() => setGameOver(true))
      }

      setScore(state.score)
    }
  }

  return { userInput, score, gameOver }
}
