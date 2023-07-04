import type { Component } from 'solid-js'
import styles from './App.module.css'
import { KeyboardKey } from './KeyboardKey'
import { TutorialLevel } from './consts'

const Key = (props: { key: string; description: string }) => {
  return (
    <tr>
      <td>
        <KeyboardKey key={props.key} />
      </td>
      <td class={styles.legendKeyDesc}>{props.description}</td>
    </tr>
  )
}

const Separator = () => {
  return <div class={styles.separator}></div>
}

const NeededScore = (props: { score: number }) => {
  return (
    <div>
      <Separator />
      <div>
        Reach the score of{' '}
        <b>
          <i>{props.score}</i>
        </b>{' '}
        to finish this level
      </div>
    </div>
  )
}

export const TutorialLegend: Component<{
  level: TutorialLevel
  neededScore: number
}> = (props) => {
  const Level = LevelComponent[props.level]
  return (
    <div class={styles.legendSection}>
      <div class={styles.tutorialLegend}>
        <h2 class={styles.legendTitle}>Tutorial 💡</h2>
        <br />

        <div class={styles.legendContent}>
          <Level />
          <NeededScore score={props.neededScore} />
        </div>
      </div>
    </div>
  )
}

const FirstLevelLegend = () => {
  return (
    <div class={styles.tutorialLegendContent}>
      <li> Welcome to VimSnake, a game to help you practice Vim motions.</li>
      <br />
      <li>
        In this game the snake doesnt move by itself, you have to move it using
        Vim motions.
      </li>
      <br />
      <li>
        In the first level we will learn how to use the basic direction motions.
        In Vim we prefer to avoid using the arrow keys, so we use the following
        keys instead:
      </li>
      <br />
      <Key key={'h'} description={'Move one cell to the left'} />
      <Key key={'l'} description={'Move one cell to the right'} />
      <Key key={'j'} description={'Move one cell down'} />
      <Key key={'k'} description={'Move one cell up'} />
    </div>
  )
}

const SecondLevelLegend = () => {
  return (
    <div class={styles.tutorialLegendContent}>
      <li>
        Our "Mission" in Vim is to move as fast as possible both vertically and
        horizontally
      </li>
      <br />
      <li>
        In this level we will introduce motions that take us to the screen
        bounds (file bounds) [up, down, left, right]
      </li>
      <br />
      <li>To move the the various screen bounds use:</li>
      <br />
      <Key key={'$'} description={'Move to end of line'} />
      <Key key={'^'} description={'Move to start of line'} />
      <Key key={'gg'} description={'Move to the first line'} />
      <Key key={'G'} description={'Move to the the last line'} />
    </div>
  )
}

const ThirdLevelLegend = () => {
  return (
    <div class={styles.tutorialLegendContent}>
      <li>
        Let us remember that Vim is a text editor, so we'd like to be able to
        move based on the presented text
      </li>
      <br />
      <li>
        In this level we will learn the word motions, Going to the beginning or
        end of a word, both forward and backwards
      </li>
      <br />
      <li>Perform word motions with the following keys:</li>
      <br />
      <table>
        <Key key={'w'} description={'move to start of next word'} />
        <Key
          key={'W'}
          description={'move to start of next word (Space delimited)'}
        />
        <Key key={'e'} description={'move to end of word'} />
        <Key key={'E'} description={'move to end of word (Space delimited)'} />
        <Key key={'b'} description={'move to start of word'} />
        <Key
          key={'B'}
          description={'move to start of word (Space delimited)'}
        />
      </table>
    </div>
  )
}

const FourthLevelLegend = () => {
  return (
    <div class={styles.tutorialLegendContent}>
      <li>
        One of the fastest ways to move horizontally is to move to an exact
        character in the line
      </li>
      <br />
      <li>
        To achieve this we can [f]ind forward of [F]ind backwards a character
      </li>
      <br />
      <li>
        At times, a character will show up multiple times in a line, so we can
        repeat the search with [;] forward or [,] backwards
      </li>
      <br />
      <li>Perform char find motions with the following keys:</li>
      <br />
      <table>
        <Key key={'f'} description={'[f]ind a character forward'} />
        <Key key={'F'} description={'[F]ind a character backwards'} />
        <Key
          key={';'}
          description={'repeat last [f/F]ind in the same direction'}
        />
        <Key
          key={','}
          description={'repeat last [f/F]ind in the opposite direction'}
        />
      </table>
    </div>
  )
}

const FifthLevelLegend = () => {
  return (
    <div class={styles.tutorialLegendContent}>
      <li>
        At times we'd like to move to a char that is one position before another
      </li>
      <br />
      <li>
        This can be helpful when the next character is more unique than the one
        we want to get to, or when we would like to get behind a common unique
        character (for ex. '.')
      </li>
      <br />
      <li>
        To do this we can use [t]ill forward or [T]ill backwards. [;] and [,]
        will work the same way as before, and will repeat the last movement
      </li>
      <br />
      <li>Perform char 'till' motions with the following keys:</li>
      <br />
      <table>
        <Key key={'t'} description={'[t]ill a character forward'} />
        <Key key={'T'} description={'[T]ill a character backwards'} />
        <Key
          key={';'}
          description={'repeat last [f/F]ind in the same direction'}
        />
        <Key
          key={','}
          description={'repeat last [f/F]ind in the opposite direction'}
        />
      </table>
    </div>
  )
}

const LevelComponent = {
  [TutorialLevel.First]: FirstLevelLegend,
  [TutorialLevel.Second]: SecondLevelLegend,
  [TutorialLevel.Third]: ThirdLevelLegend,
  [TutorialLevel.Fourth]: FourthLevelLegend,
  [TutorialLevel.Fifth]: FifthLevelLegend,
}
