import { useState } from 'react'
import ChatApp from './Pages/ChatApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ChatApp/>
    </>
  )
}

export default App
