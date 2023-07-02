import { Component } from 'solid-js'
import { useGame } from './useGame'
import styles from './App.module.css'
import { GithubLink } from './GithubLink'
import { TutorialLegend } from './TutorialLegend'
import { Score } from './Score'
import { Board, LOGO, Point, TutorialLevel } from './consts'
import { Properties } from 'solid-js/web'

interface LevelConfig {
  hideSentences?: boolean
  hideNumbers?: boolean
  dumbScore?: boolean
  foodSpawnLimit?: (board: Board, point: Point, sentences: string[]) => boolean
  neededScore: number
}

const levelsConfig: { [key in TutorialLevel]: LevelConfig } = {
  [TutorialLevel.First]: {
    hideSentences: true,
    hideNumbers: true,
    dumbScore: true,
    neededScore: 10,
  },
  [TutorialLevel.Second]: {
    hideSentences: true,
    hideNumbers: true,
    dumbScore: true,
    neededScore: 20,
    foodSpawnLimit: (board, point) =>
      point.col === 0 ||
      point.col === board.width - 1 ||
      point.row === 0 ||
      point.row === board.height - 1,
  },
  [TutorialLevel.Third]: {
    hideNumbers: true,
    dumbScore: true,
    neededScore: 30,
    foodSpawnLimit: (board, point, sentences) => {
      if (
        point.col === 0 ||
        point.col === board.width - 1 ||
        point.row === 0 ||
        point.row === board.height - 1
      ) {
        return false
      }

      return (
        sentences[point.row][point.col - 1] === ' ' ||
        sentences[point.row][point.col + 1] === ' '
      )
    },
  },
}

export const Tutorial = (props: { level: TutorialLevel }) => {
  const { level } = props
  const { userInput, score } = useGame(levelsConfig[level])

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
        <TutorialLegend
          level={level}
          neededScore={levelsConfig[level].neededScore}
        />
        <GithubLink />
      </div>
    </>
  )
}
