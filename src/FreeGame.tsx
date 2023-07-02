import { Component } from 'solid-js'
import { useGame } from './useGame'
import styles from './App.module.css'
import { LOGO } from './consts'
import { Score } from './Score'
import { Legend } from './Legend'
import { GithubLink } from './GithubLink'

export const FreeGame: Component = () => {
  const { userInput, score } = useGame()

  return (
    <>
      <div class={styles.firstColumn}>
        <img src={LOGO} alt={'logo'} width={250} class={styles.logo} />
        <Score score={score()} />
      </div>
      <div class={styles.gameContainer}>
        <div class={styles.cmd}>{userInput()}</div>
        <canvas id="canvas" height="600px" width="600px"></canvas>
      </div>
      <div class={styles.rightColumn}>
        <Legend />
        <GithubLink />
      </div>
    </>
  )
}
