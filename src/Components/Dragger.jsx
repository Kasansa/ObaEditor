import React from 'react'
import { useState } from 'react'
function Dragger() {
    const [dragged, setDragged] = useState(false)

  return (
    <button className={`btn text-white ${dragged?'bg-red-500 animate-pulse':'bg-blue-500'}`} onClick={() => setDragged(!dragged)}>{dragged?'Dragging Canvas':'Drag Canvas'}</button>
  )
}

export default Dragger