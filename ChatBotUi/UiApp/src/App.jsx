import { useState } from 'react'
import ChatApp from './ChatApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ChatApp/>
    </>
  )
}

export default App
