export const IGNORE_INPUTS = ['Shift', 'Meta', 'Arrow']
export const HJKL = ['h', 'j', 'k', 'l']
export const LINE_CMDS = ['$', '^']
export const SCREEN_CMDS = ['gg', 'G']
export const LINE_SEARCH = ['f', 'F', 't', 'T']
export const WORD_MOTIONS = ['w', 'W', 'e', 'E', 'b', 'B']

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export enum MotionType {
  LineSearch = 'line',
  Other = 'other',
}

export interface Motion {
  type: MotionType
  cmd: string
  direction: Direction
  count: number
  ignoreSave?: boolean
}

export interface Point {
  x: number
  y: number
}

export interface Board {
  width: number
  height: number
}

export const SENTENCE = 'Fyodor is do,med to hell.'
