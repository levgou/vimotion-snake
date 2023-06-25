import styles from './App.module.css'
import { createEffect, createSignal } from 'solid-js'
import { Transition } from 'solid-transition-group'

export const Score = (props: { score: number }) => {
  const [displayedScore, setDisplayedScore] = createSignal(0)
  const [show, setShow] = createSignal(false)
  const [animating, setAnimating] = createSignal(false)
  let scoreDiff: number = 0

  const animateToScore = (score: number) => {
    const interval = setInterval(() => {
      if (score !== displayedScore()) {
        setDisplayedScore(displayedScore() + 1)
      } else {
        clearInterval(interval)
      }
    }, 60)
  }

  createEffect(() => {
    if (props.score !== displayedScore() && !animating()) {
      scoreDiff = props.score - displayedScore()
      setAnimating(true)
      animateToScore(props.score)
      setShow(true)
    }
  })

  return (
    <div class={styles.score}>
      <div class={styles.center}>
        <div class={styles.title}>SCORE:</div>
        <div class={styles.score}>{displayedScore()}</div>
        <Transition
          onEnter={(el, done) => {
            const a = el.animate(
              [
                { transform: 'translate3d(0, 100%, 0)', opacity: 1 },
                { transform: 'translate3d(0, 0, 0)', opacity: 0 },
              ],
              {
                duration: 1300,
              }
            )
            a.onfinish = () => {
              setShow(false)
              setAnimating(false)
              el.setAttribute('style', 'display: none;')
              done()
            }
          }}
        >
          {show() && <div class={styles.tag}>+{scoreDiff}</div>}
        </Transition>
      </div>
    </div>
  )
}
