import type { Component } from 'solid-js'
import styles from './App.module.css'

export const Legend: Component = () => {
  return (
    <div class={styles.legendSection}>
      <div class={styles.legend}>
        <h3>Motions</h3>
        <br />
        <li>h - left</li>
        <li>l - Right</li>
        <li>j - Down</li>
        <li>k - Up</li>
        -------------------------
        <li>[num][direction] - move [num] of times in [direction] (hjkl) </li>
        -------------------------
        <li>w - move to start of next word</li>
        <li>W - move to start of next word (Space delimited)</li>
        <li>e - move to end of word</li>
        <li>E - move to end of word (Space delimited)</li>
        <li>b - move to start of word</li>
        <li>B - move to start of word (Space delimited)</li>
        -------------------------
        <li>$ - End Of Line</li>
        <li>^ - Start Of Line</li>
        -------------------------
        <li>f[char] - First occurrence of [char] to the right</li>
        <li>F[char] - First occurrence of [char] to the left</li>
        <li>
          t[char] - One char before the first occurrence of [char] to the right
        </li>
        <li>
          T[char] - One char before the first occurrence of [char] to the Left
        </li>
        <li>; - Repeat last [fFtT] motion</li>
        <li>, - Repeat last [fFtT] motion in opposite direction</li>
        -------------------------
      </div>
    </div>
  )
}
