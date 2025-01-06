import React from 'react'
import { useState } from 'react'
function Dragger({setCanvasDragging, canvasDragging}) {

  return (
    <button className={`btn text-white ${canvasDragging?'bg-red-500 animate-pulse':'bg-blue-500'}`} onClick={() => setCanvasDragging(!canvasDragging)}>{canvasDragging?'Dragging Canvas':'Drag Canvas'}</button>
  )
}

export default Dragger