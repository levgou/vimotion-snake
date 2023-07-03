import { cookieStorage, createStorageSignal } from '@solid-primitives/storage'

const [imageUri, setImageUri] = createStorageSignal<string>('imageUri', '', {
  api: cookieStorage,
})
const [name, setName] = createStorageSignal<string>('name', '', {
  api: cookieStorage,
})
const [email, setEmail] = createStorageSignal<string>('email', '', {
  api: cookieStorage,
})

const clearCookies = () => {
  console.log('clearing cookies')
  setImageUri('')
  setName('')
  setEmail('')
}

const allReady = () =>
  !!imageUri()?.length && !!name()?.length && !!email()?.length

export const cookies = {
  imageUri,
  name,
  email,
  setImageUri,
  setName,
  setEmail,
  clearCookies,
  allReady,
}
