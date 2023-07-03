import { cookies } from '../cookies'
import { GoogleLogin } from './LoginButton'
import { LoginResult } from './types'
import { Show } from 'solid-js'
import styles from './Auth.module.css'

interface Props {
  onSuccess: (res: LoginResult) => void
  onFailure: (res: any) => void
  clientId: string
}

const Profile = (props: { name: string; imageUri: string }) => {
  const { clearCookies } = cookies
  return (
    <div class={styles.profileContainer}>
      <img
        src={props.imageUri}
        alt={'profile'}
        width={50}
        class={styles.profilePicture}
      />
      <div class={styles.textContainer}>{props.name}</div>
      <div onClick={clearCookies} class={styles.logoutContainer}>
        ☠️
      </div>
    </div>
  )
}

export const LoginOrLogout = (props: Props) => {
  const { allReady, imageUri, name } = cookies

  return (
    <Show
      when={allReady()}
      fallback={
        <GoogleLogin
          onSuccess={props.onSuccess}
          onFailure={props.onFailure}
          clientId={props.clientId}
        />
      }
    >
      <Profile name={name()!} imageUri={imageUri()!} />
    </Show>
  )
}
