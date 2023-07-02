import styles from './App.module.css'
import { ARCADE, LOGO, TUTORIAL_01, TUTORIAL_02, TUTORIAL_03 } from './consts'
import { A } from '@solidjs/router'

const Separator = () => {
  return <div class={styles.levelsSeparator}></div>
}

const Level = (props: { text: string; image: string }) => {
  return (
    <div class={styles.levelContainer}>
      <img
        src={props.image}
        alt={'Arcade'}
        width={'150px'}
        height={'140px'}
        class={styles.levelsImage}
      />
      <div class={styles.levelText}>{props.text}</div>
    </div>
  )
}

export const Levels = () => {
  return (
    <div>
      <img src={LOGO} alt={'logo'} width={250} />
      <div class={styles.levelsContainer}>
        <div class={styles.levelsLine}>
          <A href={'/arcade'}>
            <Level text={'Arcade'} image={ARCADE} />
          </A>
        </div>
        <Separator />
        <div class={styles.levelsLine}>
          <A href={'/tutorial_01'}>
            <Level text={'Intro'} image={TUTORIAL_01} />
          </A>
          <A href={'/tutorial_02'}>
            <Level text={'Screen Motion'} image={TUTORIAL_02} />
          </A>
        </div>
        <div class={styles.levelsLine}>
          <A href={'/tutorial_03'}>
            <Level text={'Word Motion'} image={TUTORIAL_03} />
          </A>
        </div>
      </div>
    </div>
  )
}
