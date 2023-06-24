import styles from './App.module.css'
import { Component, createEffect, createSignal, For } from 'solid-js'
import { TransitionGroup } from 'solid-transition-group'

export const Score = ({
  score,
  scoreIncrease,
}: {
  score: number
  scoreIncrease: number
}) => {
  const [displayedScore, setDisplayedScore] = createSignal(0)

  const animateToScore = (score: number) => {
    requestAnimationFrame(() => {
      if (score !== displayedScore()) {
        setDisplayedScore(displayedScore() + 1)
      }
    })
  }

  createEffect(() => {
    if (score !== displayedScore()) {
      animateToScore(score)
    }
  })

  createEffect(() => {
    if (scoreIncrease > 0) {
    }
  })

  return (
    <div style={{ width: '300px' }}>
      <div class={styles.center}>
        <div class={styles.title}>SCORE:</div>
        <div class={styles.tag}>+100</div>
        <div class={styles.score}>{displayedScore()}</div>
      </div>
    </div>
  )
}
