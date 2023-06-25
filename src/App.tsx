import type { Component } from 'solid-js'

import styles from './App.module.css'
import { createSignal, onMount } from 'solid-js'
import { Board, IGNORE_INPUTS, Motion, ROW_COUNT } from './consts'
import { generateMotion } from './motion'
import { Legend } from './Legend'
import { SnakeState } from './SnakeState'
import { SnakeCanvas } from './snake'
import { Score } from './Score'
import { GithubLink } from './GithubLink'

// todo: keys to add support for
// - backspace -
// - u - undo
// -

const App: Component = () => {
  const [userInput, setUserInput] = createSignal('')
  const [score, setScore] = createSignal(0)
  const state = new SnakeState(ROW_COUNT)

  let lastMotion: Motion | null = null
  let canvas: SnakeCanvas

  onMount(() => {
    canvas = new SnakeCanvas(state, onInput)
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

  return (
    <div class={styles.App}>
      <div class={styles.gameContainer}>
        <div class={styles.cmd}>{userInput()}</div>
        <canvas id="canvas" height="600px" width="600px"></canvas>
      </div>
      <Score score={score()} />
      <div class={styles.rightColumn}>
        <Legend />
        <GithubLink />
      </div>
    </div>
  )
}

export default App
