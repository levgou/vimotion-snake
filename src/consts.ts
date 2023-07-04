export const IGNORE_INPUTS = ['Shift', 'Meta', 'Arrow']
export const HJKL = ['h', 'j', 'k', 'l']
export const LINE_CMDS = ['$', '^']
export const SCREEN_CMDS = ['gg', 'G', 'H', 'L', 'M']
export const LINE_SEARCH = ['f', 'F', 't', 'T']
export const WORD_MOTIONS = ['w', 'W', 'e', 'E', 'b', 'B', 'ge']

export const SNAKE_LENGTH = 5
export const CANVAS_SIZE = 600
export const CANVAS_PLAY_OFFSET = 100
export const CANVAS_PLAY_SIZE = CANVAS_SIZE - CANVAS_PLAY_OFFSET

export const CELL_SIZE = 20
export const ROW_COUNT = (CANVAS_SIZE - CANVAS_PLAY_OFFSET) / CELL_SIZE
export const FPS = 25

export const OFS = (n: number) => n + CANVAS_PLAY_OFFSET
export const COORD_OF = (n: number) => n / CELL_SIZE
export const COORD = (i: number) => i * CELL_SIZE

export const CLIENT_ID =
  '589159628504-70ah5nthsuoh2qj07jjclp3vklh1m6pd.apps.googleusercontent.com'

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
  col: number
  row: number
}

export interface Board {
  width: number
  height: number
}

export enum TutorialLevel {
  First = 'first',
  Second = 'second',
  Third = 'third',
  Fourth = 'fourth',
  Fifth = 'fifth',
}

export const SENTENCE = 'Fyodor is do,med to hell.'
import sentences from './assets/25_sentences.json'

export const SENTENCES = sentences
export const SENTENCE_COUNT = sentences.length

export const randomSentence = () => {
  const index = Math.floor(Math.random() * SENTENCE_COUNT)
  return SENTENCES[index]
}

import SNAKE_BODY_1 from './assets/snake_body_20_20_1.png'
import SNAKE_BODY_2 from './assets/snake_body_20_20_2.png'
import SNAKE_BODY_3 from './assets/snake_body_20_20_3.png'
import SNAKE_BODY_4 from './assets/snake_body_20_20_4.png'

import SHL from './assets/snake_body_20_20_head_left.png'
import SHR from './assets/snake_body_20_20_head_right.png'
import SHT from './assets/snake_body_20_20_head_top.png'
import SHB from './assets/snake_body_20_20_head_bottom.png'

export const SNAKE_HEAD_LEFT = new Image()
SNAKE_HEAD_LEFT.src = SHL
export const SNAKE_HEAD_RIGHT = new Image()
SNAKE_HEAD_RIGHT.src = SHR
export const SNAKE_HEAD_TOP = new Image()
SNAKE_HEAD_TOP.src = SHT
export const SNAKE_HEAD_BOTTOM = new Image()
SNAKE_HEAD_BOTTOM.src = SHB

import STT from './assets/snake_body_20_20_tail_top.png'
import STB from './assets/snake_body_20_20_tail_bottom.png'
import STL from './assets/snake_body_20_20_tail_left.png'
import STR from './assets/snake_body_20_20_tail_right.png'

export const SNAKE_TAIL_TOP = new Image()
SNAKE_TAIL_TOP.src = STT
export const SNAKE_TAIL_BOTTOM = new Image()
SNAKE_TAIL_BOTTOM.src = STB
export const SNAKE_TAIL_LEFT = new Image()
SNAKE_TAIL_LEFT.src = STL
export const SNAKE_TAIL_RIGHT = new Image()
SNAKE_TAIL_RIGHT.src = STR

export const SNAKE_BODY_IMAGES: HTMLImageElement[] = [
  new Image(),
  new Image(),
  new Image(),
  new Image(),
]

SNAKE_BODY_IMAGES[0].src = SNAKE_BODY_1
SNAKE_BODY_IMAGES[1].src = SNAKE_BODY_2
SNAKE_BODY_IMAGES[2].src = SNAKE_BODY_3
SNAKE_BODY_IMAGES[3].src = SNAKE_BODY_4

import apple from './assets/apple.png'

export const APPLE = new Image()
APPLE.src = apple

import cherry from './assets/cherry.png'

export const CHERRY = new Image()
CHERRY.src = cherry

import strawberry from './assets/strawberry.png'

export const STRAWBERRY = new Image()
STRAWBERRY.src = strawberry

import watermelon from './assets/watermelon.png'

export const WATERMELON = new Image()
WATERMELON.src = watermelon

import foodSound from './assets/food_sound.wav'
import veryGoodVeryNice from './assets/very_good_very_nice.wav'

export const FOOD_SOUND = new Audio(foodSound)
export const VERY_GOOD_VERY_NICE = new Audio(veryGoodVeryNice)

import gh from './assets/github.png'

export const GITHUB = gh

import logo from './assets/logo.png'

export const LOGO = logo

import arcade from './assets/arcade_level.png'
import tutorial_01 from './assets/levels_tutorial_01.png'
import tutorial_02 from './assets/levels_tutorial_02.png'
import tutorial_03 from './assets/levels_tutorial_03.png'
import tutorial_04 from './assets/levels_tutorial_04.png'
import tutorial_05 from './assets/levels_tutorial_05.png'

export const ARCADE = arcade
export const TUTORIAL_01 = tutorial_01
export const TUTORIAL_02 = tutorial_02
export const TUTORIAL_03 = tutorial_03
export const TUTORIAL_04 = tutorial_04
export const TUTORIAL_05 = tutorial_05

import googleIcon from './assets/Google__G__Logo.svg'

export const GOOGLE_ICON = googleIcon
