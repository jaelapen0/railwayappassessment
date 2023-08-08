import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GitRepoIssues from './components/Github'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GitRepoIssues />
    </>
  )
}

export default App
