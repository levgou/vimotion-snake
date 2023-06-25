import { GITHUB } from './consts'
import styles from './App.module.css'

export const GithubLink = () => {
  return (
    <div class={styles.github}>
      <a href="https://github.com/levgou/vimotion-snake">
        <img src={GITHUB} alt={'github logo'} />
      </a>
    </div>
  )
}
