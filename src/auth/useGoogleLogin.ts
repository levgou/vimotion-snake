import { Component, createEffect, createSignal, onMount } from 'solid-js'
import { gapi, loadAuth2, loadAuth2WithProps } from 'gapi-script'
import { LoginResult } from './types'

interface Props {
  onSuccess: (res: any) => void
  onFailure: (res: any) => void
  onScriptLoadFailure?: (err: any) => void
  onAutoLoadFinished?: (val: boolean) => void
  clientId: string
  jsSrc?: string
  onRequest?: () => void
  buttonText?: string
  scope: string
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

export const useGoogleLogin = ({
  onSuccess = (res: LoginResult) => {},
  onAutoLoadFinished = () => {},
  onFailure = () => {},
  onRequest = () => {},
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
  prompt,
}: Props) => {
  let auth2: any = null
  onMount(async () => {
    auth2 = await loadAuth2WithProps(gapi, {
      client_id: clientId,
      cookie_policy: cookiePolicy,
      login_hint: loginHint,
      hosted_domain: hostedDomain,
      fetch_basic_profile: fetchBasicProfile,
      discoveryDocs,
      ux_mode: uxMode,
      redirect_uri: redirectUri,
      scope,
      access_type: accessType,
    })
  })

  function handleSigninSuccess(res: any) {
    const basicProfile = res.getBasicProfile()
    const authResponse = res.getAuthResponse(true)
    res.googleId = basicProfile.getId()
    res.tokenObj = authResponse
    res.tokenId = authResponse.id_token
    res.accessToken = authResponse.access_token
    res.profileObj = {
      googleId: basicProfile.getId(),
      imageUrl: basicProfile.getImageUrl(),
      email: basicProfile.getEmail(),
      name: basicProfile.getName(),
      givenName: basicProfile.getGivenName(),
      familyName: basicProfile.getFamilyName(),
    }
    onSuccess(res)
  }

  function signIn(e: Event) {
    if (e) {
      e.preventDefault() // to prevent submit if used within form
    }
    if (!auth2) {
      return
    }
    const options = {
      prompt,
    }
    onRequest()
    if (responseType === 'code') {
      auth2.grantOfflineAccess(options).then(
        (res: any) => onSuccess(res),
        (err: any) => onFailure(err)
      )
    } else {
      auth2.signIn(options).then(
        (res: any) => handleSigninSuccess(res),
        (err: any) => onFailure(err)
      )
    }
  }

  return { signIn, loaded: !!auth2 }
}
