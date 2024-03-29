import type { Component } from 'solid-js'

import styles from './App.module.css'
import { Tutorial } from './Tutorial'
import { Route, Router, Routes } from '@solidjs/router'
import { FreeGame } from './FreeGame'
import { TutorialLevel } from './consts'
import { Levels } from './Levels'

// todo: keys to add support for
// - backspace -
// - u - undo
// -

const App: Component = () => {
  return (
    <Router>
      <div class={styles.App}>
        <Routes>
          <Route path="/" element={<Levels />} />
          <Route path="/arcade" element={<FreeGame />} />
          <Route
            path="/tutorial_01"
            element={<Tutorial level={TutorialLevel.First} />}
          />
          <Route
            path="/tutorial_02"
            element={<Tutorial level={TutorialLevel.Second} />}
          />
          <Route
            path="/tutorial_03"
            element={<Tutorial level={TutorialLevel.Third} />}
          />
          <Route
            path="/tutorial_04"
            element={<Tutorial level={TutorialLevel.Fourth} />}
          />
          <Route
            path="/tutorial_05"
            element={<Tutorial level={TutorialLevel.Fifth} />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
