import type { Component } from 'solid-js'
import styles from './App.module.css'
import { KeyboardKey } from './KeyboardKey'

const Separator = () => {
  return <div class={styles.separator} />
}

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

export const Legend: Component = () => {
  return (
    <div class={styles.legendSection}>
      <div class={styles.legend}>
        <h2 class={styles.legendTitle}>Motions</h2>
        <br />
        <div class={styles.legendContent}>
          <table>
            <Key key={'h'} description={'Left'} />
            <Key key={'l'} description={'Right'} />
            <Key key={'j'} description={'Down'} />
            <Key key={'k'} description={'Up'} />
          </table>
          <Separator />
          <table>
            <Key
              key={'[num][direction]'}
              description={'move [num] of times in [direction] (hjkl)'}
            />
          </table>
          <Separator />
          <table>
            <Key key={'w'} description={'move to start of next word'} />
            <Key
              key={'W'}
              description={'move to start of next word (Space delimited)'}
            />
            <Key key={'e'} description={'move to end of word'} />
            <Key
              key={'E'}
              description={'move to end of word (Space delimited)'}
            />
            <Key key={'b'} description={'move to start of word'} />
            <Key
              key={'B'}
              description={'move to start of word (Space delimited)'}
            />
          </table>
          <Separator />
          <table>
            <Key key={'$'} description={'End Of Line'} />
            <Key key={'^'} description={'Start Of Line'} />
            <Key key={'gg'} description={'Move to the first line'} />
            <Key key={'H'} description={'Move to the first line'} />
            <Key key={'G'} description={'Move to the the last line'} />
            <Key key={'L'} description={'Move to the the last line'} />
            <Key key={'M'} description={'Move to middle line'} />
          </table>
          <Separator />
          <table>
            <Key
              key={'f[char]'}
              description={'First occurrence of [char] to the right'}
            />
            <Key
              key={'F[char]'}
              description={'First occurrence of [char] to the left'}
            />
            <Key
              key={'t[char]'}
              description={
                'One char before the first occurrence of [char] to the right'
              }
            />
            <Key
              key={'T[char]'}
              description={
                'One char before the first occurrence of [char] to the Left'
              }
            />
            <Key key={';'} description={'Repeat last [fFtT] motion'} />
            <Key
              key={','}
              description={'Repeat last [fFtT] motion in opposite direction'}
            />
          </table>
        </div>
      </div>
    </div>
  )
}
