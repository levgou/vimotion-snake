interface Color {
  r: number
  g: number
  b: number
}

// Colors
const colorPalette = {
  bg: { r: 12, g: 9, b: 29 },
  matter: [
    { r: 36, g: 18, b: 42 }, // darkPRPL
    { r: 78, g: 36, b: 42 }, // rockDust
    { r: 252, g: 178, b: 96 }, // solorFlare
    { r: 253, g: 238, b: 152 }, // totesASun
  ],
}

// Used to find the rocks next point in space, accounting for speed and direction
const updateParticleModel = (p: Particle) => {
  let a = 180 - (p.d + 90) // find the 3rd angle
  p.d > 0 && p.d < 180
    ? (p.x += (p.s * Math.sin(p.d)) / Math.sin(p.s))
    : (p.x -= (p.s * Math.sin(p.d)) / Math.sin(p.s))
  p.d > 90 && p.d < 270
    ? (p.y += (p.s * Math.sin(a)) / Math.sin(p.s))
    : (p.y -= (p.s * Math.sin(a)) / Math.sin(p.s))
  return p
}

// Provides some nice color variation
// Accepts a rgba object
// returns a modified rgba object or a rgba string if true is passed in for argument 2
const colorVariation = (
  color: Color,
  returnString: boolean,
  config: Config
) => {
  let r, g, b, a

  r = Math.round(
    Math.random() * config.colorVariation - config.colorVariation / 2 + color.r
  )
  g = Math.round(
    Math.random() * config.colorVariation - config.colorVariation / 2 + color.g
  )
  b = Math.round(
    Math.random() * config.colorVariation - config.colorVariation / 2 + color.b
  )
  a = Math.random() + 0.5
  if (returnString) {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
  } else {
    return { r, g, b, a }
  }
}

interface Config {
  particleNumber: number
  maxParticleSize: number
  maxSpeed: number
  colorVariation: number
}

export const winConfig = {
  particleNumber: 400,
  maxParticleSize: 10,
  maxSpeed: 40,
  colorVariation: 250,
}

export const eatConfig = {
  particleNumber: 40,
  maxParticleSize: 3,
  maxSpeed: 10,
  colorVariation: 250,
}

class Particle {
  x: number
  y: number
  r: number
  c: string
  s: number
  d: number

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    config: Config
  ) {
    this.x = x || Math.round(Math.random() * width)
    this.y = y || Math.round(Math.random() * height)

    // Radius of the space dust
    this.r = Math.ceil(Math.random() * config.maxParticleSize)
    // Color of the rock, given some randomness
    this.c = colorVariation(
      colorPalette.matter[
        Math.floor(Math.random() * colorPalette.matter.length)
      ],
      true,
      config
    ) as string

    // Speed of which the rock travels
    this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), 0.7)
    // Direction the Rock flies
    this.d = Math.round(Math.random() * 360)
  }
}

export const explode = (x: number, y: number, config: Config) => {
  // Little Canvas things
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement
  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  // Some Variables hanging out
  let particles: Particle[] = []
  // const centerX = canvas.width / 2
  // const centerY = canvas.height / 2

  // Just the function that physically draws the particles
  // Physically? sure why not, physically.
  const drawParticle = (x: number, y: number, r: number, c: string) => {
    ctx.beginPath()
    ctx.fillStyle = c
    ctx.arc(x, y, r, 0, 2 * Math.PI, false)
    ctx.fill()
    ctx.closePath()
  }

  // Remove particles that aren't on the canvas
  const cleanUpArray = () => {
    particles = particles.filter((p) => {
      return p.x > -100 && p.y > -100
    })
  }

  const initParticles = (numParticles: number, x: number, y: number) => {
    console.log('initParticles')
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(x, y, canvas.width, canvas.height, config))
    }
    particles.forEach((p) => {
      drawParticle(p.x, p.y, p.r, p.c)
    })
  }

  // Our Frame function
  const frame = () => {
    // Draw background first
    // drawBg(colorPalette.bg)
    // Update Particle models to new position
    particles.map((p) => {
      return updateParticleModel(p)
    })
    // Draw em'
    particles.forEach((p) => {
      drawParticle(p.x, p.y, p.r, p.c)
    })
    // Play the same song? Ok!
    window.requestAnimationFrame(frame)
  }

  // Click listener

  // First Frame
  frame()
  cleanUpArray()
  initParticles(config.particleNumber, x, y)

  // First particle explosion
  // initParticles(config.particleNumber)
}
