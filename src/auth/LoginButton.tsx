import { useGoogleLogin } from './useGoogleLogin'
import styles from './Auth.module.css'
import { Component, createSignal } from 'solid-js'
import { GOOGLE_ICON } from '../consts'
import { LoginResult } from './types'

interface Props {
  onSuccess: (res: LoginResult) => void
  onFailure: (res: any) => void
  onScriptLoadFailure?: (err: any) => void
  onAutoLoadFinished?: (val: boolean) => void
  clientId: string
  jsSrc?: string
  onRequest?: () => void
  buttonText?: string
  scope?: string
  className?: string
  redirectUri?: string
  cookiePolicy?: string
  loginHint?: string
  hostedDomain?: string
  children?: Component
  disabledStyle?: object
  fetchBasicProfile?: boolean
  prompt?: string
  tag?: string
  autoLoad?: boolean
  disabled?: boolean
  discoveryDocs?: []
  uxMode?: string
  isSignedIn?: boolean
  responseType?: string
  type?: string
  accessType?: string
  theme?: string
  icon?: boolean
}

const defaultProps = {
  type: 'button',
  tag: 'button',
  buttonText: 'Sign in with Google',
  scope: 'profile email',
  accessType: 'online',
  prompt: '',
  cookiePolicy: 'single_host_origin',
  fetchBasicProfile: true,
  isSignedIn: false,
  uxMode: 'popup',
  disabledStyle: {
    opacity: 0.6,
  },
  icon: true,
  theme: 'light',
  onRequest: () => {},
}

export const GoogleLogin = (props: Props) => {
  const [hovered, setHovered] = createSignal(false)
  const [active, setActive] = createSignal(false)

  const {
    onSuccess,
    onAutoLoadFinished,
    onRequest,
    onFailure,
    onScriptLoadFailure,
    tag,
    type,
    className,
    disabledStyle,
    buttonText,
    children,
    theme,
    icon,
    disabled: disabledProp,
    clientId,
    cookiePolicy,
    loginHint,
    hostedDomain,
    autoLoad,
    isSignedIn,
    fetchBasicProfile,
    redirectUri,
    discoveryDocs,
    uxMode,
    scope,
    accessType,
    responseType,
    jsSrc,
    prompt,
  } = { ...defaultProps, ...props }

  const { signIn, loaded } = useGoogleLogin({
    onSuccess,
    onAutoLoadFinished,
    onRequest,
    onFailure,
    onScriptLoadFailure,
    clientId,
    cookiePolicy,
    loginHint,
    hostedDomain,
    autoLoad,
    isSignedIn,
    fetchBasicProfile,
    redirectUri,
    discoveryDocs,
    uxMode,
    scope,
    accessType,
    responseType,
    jsSrc,
    prompt,
  })
  const disabled = disabledProp || !loaded

  const buttonClasses = () => {
    const classes = [styles.initialStyle]
    if (active()) {
      classes.push(styles.activeStyle)
    }
    if (hovered()) {
      classes.push(styles.hoveredStyle)
    }
    return classes.join(' ')
  }

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setActive(false)
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onClick={signIn}
      class={buttonClasses()}
    >
      <img src={GOOGLE_ICON} alt={'G'} width={18} class={styles.googleIcon} />
      <span class={styles.authSpanStyle}>{buttonText}</span>
    </button>
  )
}
