import {
  Board,
  Direction,
  HJKL,
  LINE_CMDS,
  LINE_SEARCH,
  Motion,
  MotionType,
  Point,
  SCREEN_CMDS,
  WORD_MOTIONS,
} from './consts'

export const endsWithDirection = (s: string): boolean =>
  HJKL.some((d) => s.endsWith(d))

export const endsWithLineCmd = (s: string): boolean =>
  LINE_CMDS.some((d) => s.endsWith(d))

export const isScreenCmd = (s: string): boolean => SCREEN_CMDS.includes(s)

export const isLineSearch = (s: string): boolean =>
  LINE_SEARCH.some((d) => s.startsWith(d)) && s.length === 2

const isWordMotion = (s: string) => WORD_MOTIONS.includes(s)

export const repeatLineSearch = (s: string): boolean => {
  const char = s.at(-1) || ''
  return [',', ';'].includes(char)
}

export const hjklToDirection = (keycode: number | string) => {
  switch (keycode) {
    case 72:
    case 'h':
      return Direction.Left
    case 75:
    case 'k':
      return Direction.Up
    case 76:
    case 'l':
      return Direction.Right
    case 74:
    case 'j':
      return Direction.Down
    default:
      return Direction.Right
  }
}

const fFtTMotion = (
  board: Board,
  head: Point,
  lineSentence: string,
  cmd: string
): Motion | null => {
  const char = cmd.at(-1) || ''
  const ft = cmd.at(0) || ''

  let tail = ''
  if (['f', 't'].includes(ft)) {
    tail = lineSentence.slice(head.col + 1)
  } else {
    tail = lineSentence.slice(0, head.col)
  }
  if (!tail.includes(char)) {
    return {
      cmd,
      direction: Direction.Right,
      count: 0,
      type: MotionType.LineSearch,
    }
  }

  if (['f', 't'].includes(ft)) {
    const count = tail.indexOf(char) + 1
    return {
      cmd,
      direction: Direction.Right,
      count: ft === 'f' ? count : count - 1,
      type: MotionType.LineSearch,
    }
  } else {
    const count = tail.length - tail.lastIndexOf(char)
    return {
      cmd,
      direction: Direction.Left,
      count: ft === 'F' ? count : count - 1,
      type: MotionType.LineSearch,
    }
  }
}

const screenMotion = (
  cmd: string,
  board: Board,
  head: Point
): Motion | null => {
  const moveToTop = cmd === 'gg'
  if (moveToTop) {
    return {
      cmd,
      direction: Direction.Up,
      count: head.row,
      type: MotionType.Other,
    }
  } else {
    return {
      cmd,
      direction: Direction.Down,
      count: board.height - head.row - 1,
      type: MotionType.Other,
    }
  }
}

const linePositionMotion = (
  board: Board,
  cmd: string,
  head: Point
): Motion | null => {
  const moveToEnd = cmd.endsWith('$')
  if (moveToEnd) {
    return {
      cmd,
      direction: Direction.Right,
      count: board.width - head.col - 1,
      type: MotionType.Other,
    }
  } else {
    return {
      cmd,
      direction: Direction.Left,
      count: head.col + 1,
      type: MotionType.Other,
    }
  }
}

const hjklMotion = (cmd: string): Motion | null => {
  const direction = hjklToDirection(cmd.at(-1) || '')
  let count = 1

  if (cmd.length > 1) {
    count = parseInt(cmd.slice(0, -1), 10)
  }

  if (isNaN(count)) {
    console.error(`Bad command: ${cmd}`)
    count = 1
  }

  return {
    cmd,
    count,
    direction,
    type: MotionType.Other,
  }
}

function repeatLineSearchMotion(
  board: Board,
  head: Point,
  lineSentence: string,
  lastMotion: Motion | null,
  cmd: string
): Motion | null {
  if (!lastMotion) {
    return null
  }
  let motion: Motion | null = null
  if (cmd === ';') {
    motion = fFtTMotion(board, head, lineSentence, lastMotion.cmd)
  } else {
    const lastMotionCmd = lastMotion.cmd[0]
    const lastMotionTarget = lastMotion.cmd[1]
    let oppositeCmd = ''
    if (lastMotionCmd === 'f') {
      oppositeCmd = 'F'
    } else if (lastMotionCmd === 'F') {
      oppositeCmd = 'f'
    } else if (lastMotionCmd === 't') {
      oppositeCmd = 'T'
    } else {
      oppositeCmd = 't'
    }

    motion = fFtTMotion(
      board,
      head,
      lineSentence,
      oppositeCmd + lastMotionTarget
    )
  }

  if (motion) {
    motion.ignoreSave = true
  }
  return motion
}

const WORD_SEP = /[a-zA-Z0-9]+|[^a-zA-Z\d\s:]+/g
const wordMotion = (
  board: Board,
  head: Point,
  lineSentence: string,
  cmd: string
) => {
  const wordSep = ['w', 'e', 'b'].includes(cmd) ? WORD_SEP : /[^ ]+/g

  let tail = ''
  if (['w', 'e'].includes(cmd.toLowerCase())) {
    tail = lineSentence.slice(head.col + 1)
  } else {
    tail = lineSentence.slice(0, head.col)
  }
  const groups = [...tail.matchAll(wordSep)]
  const allGroups = [...lineSentence.matchAll(wordSep)].map((x) => x[0])
  const realTokens = groups.filter((g) => allGroups.includes(g[0]))

  if (realTokens.length === 0) {
    return null
  }

  const [str, idx] = [groups[0][0], groups[0].index]
  const [realStr, realIdx] = [realTokens[0][0], realTokens[0].index]

  if (realIdx === undefined || idx === undefined) {
    console.warn(`bad token: ${realStr} ${realIdx} ${str} ${idx}`)
    return null
  }

  // on w we jump to the next token excluding the current
  if (cmd.toLowerCase() === 'w') {
    return {
      cmd,
      direction: Direction.Right,
      count: realIdx + 1,
      type: MotionType.Other,
    }
    // we jump to the next end of token including the current
  } else if (cmd.toLowerCase() === 'e') {
    return {
      cmd,
      direction: Direction.Right,
      count: idx + str.length,
      type: MotionType.Other,
    }
  }

  const reverseTail = [...tail].reverse().join('')
  const backGroups = [...reverseTail.matchAll(wordSep)]

  const [strRev, idxRev] = [backGroups[0][0], backGroups[0].index]
  if (idxRev === undefined) {
    console.warn(`bad token: ${strRev} ${idxRev}`)
    return null
  }

  console.log(strRev, idxRev)
  // we jump to the previous start of token including the current
  if (cmd.toLowerCase() === 'b') {
    return {
      cmd,
      direction: Direction.Left,
      count: idxRev + strRev.length,
      type: MotionType.Other,
    }
  }

  return null
}

export const generateMotion = (
  board: Board,
  head: Point,
  lineSentence: string,
  lastMotion: null | Motion,
  cmd: string
): Motion | null => {
  if (cmd === 'Escape') {
    return null
  } else if (isWordMotion(cmd)) {
    return wordMotion(board, head, lineSentence, cmd)
  } else if (isLineSearch(cmd)) {
    return fFtTMotion(board, head, lineSentence, cmd)
  } else if (repeatLineSearch(cmd)) {
    return repeatLineSearchMotion(board, head, lineSentence, lastMotion, cmd)
  } else if (isScreenCmd(cmd)) {
    return screenMotion(cmd, board, head)
  } else if (endsWithLineCmd(cmd)) {
    return linePositionMotion(board, cmd, head)
  } else if (endsWithDirection(cmd)) {
    return hjklMotion(cmd)
  }

  return null
}
