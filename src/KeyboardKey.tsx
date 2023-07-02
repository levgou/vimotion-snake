import styles from './App.module.css'

export const KeyboardKey = (props: { key: string }) => (
  <div class={styles.kbd}>{props.key}</div>
)
