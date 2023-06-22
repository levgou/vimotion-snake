import type { Component } from 'solid-js'

import styles from './App.module.css'
import { createSignal, onMount } from 'solid-js'
import { newGame, sentences } from './snake'
import {
  Board,
  HJKL,
  IGNORE_INPUTS,
  LINE_CMDS,
  LINE_SEARCH,
  Motion,
  Point,
  randomSentence,
} from './consts'
import { generateMotion } from './motion'
import { Legend } from './Legend'

const App: Component = () => {
  const [userInput, setUserInput] = createSignal('')
  let board: Board = { width: 0, height: 0 }
  let lastMotion: Motion | null = null

  onMount(() => {
    board = newGame(onInput)
  })

  const onInput = (head: Point, c: string): Motion | null => {
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
      board,
      head,
      sentences[head.y],
      lastMotion,
      userInput()
    )
    if (!motion?.ignoreSave) {
      lastMotion = motion
    }
    return motion
  }

  return (
    <div class={styles.App}>
      <div class={styles.gameContainer}>
        <div class={styles.cmd}>{userInput()}</div>
        <canvas id="canvas" height="600px" width="600px"></canvas>
      </div>
      <Legend />
    </div>
  )
}

export default App
