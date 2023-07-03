import styles from './App.module.css'
import {
  ARCADE,
  CLIENT_ID,
  LOGO,
  TUTORIAL_01,
  TUTORIAL_02,
  TUTORIAL_03,
} from './consts'
import { A } from '@solidjs/router'
import { cookies } from './cookies'
import { createEffect, createSignal, onMount } from 'solid-js'
import { LoginOrLogout } from './auth/LoginOrLogout'

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
  const { setImageUri, setEmail, setName } = cookies

  return (
    <div class={styles.mainContainer}>
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
      <LoginOrLogout
        onSuccess={(res) => {
          console.log(res)
          setImageUri(res.profileObj.imageUrl)
          setEmail(res.profileObj.email)
          setName(res.profileObj.givenName)
        }}
        onFailure={(err) => console.warn(err)}
        clientId={CLIENT_ID}
      />
    </div>
  )
}
