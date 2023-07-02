import { createSignal, onMount } from 'solid-js'
import { SnakeState } from './SnakeState'
import { Board, IGNORE_INPUTS, Motion, Point, ROW_COUNT } from './consts'
import { SnakeCanvas } from './snake'
import { generateMotion } from './motion'

export const useGame = ({
  hideNumbers,
  hideSentences,
  dumbScore,
  foodSpawnLimit,
}: {
  hideSentences?: boolean
  hideNumbers?: boolean
  dumbScore?: boolean
  foodSpawnLimit?: (board: Board, point: Point, sentences: string[]) => boolean
} = {}) => {
  const [userInput, setUserInput] = createSignal('')
  const [score, setScore] = createSignal(0)
  const state = new SnakeState(ROW_COUNT, !!dumbScore, foodSpawnLimit)

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
      state.moveSnake(motion)
      setScore(state.score)
    }
  }

  return { userInput, score }
}
