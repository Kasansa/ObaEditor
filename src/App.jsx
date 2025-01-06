import React, { useState, useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ImageUploader from "./Components/ImageUploader";
import FontMenu from "./Components/FontMenu";
import { ResizableBox } from "react-resizable";
import Draggable from "react-draggable";
import "react-resizable/css/styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faCopy, faRotate, faLayerGroup, faEraser, faExpand } from '@fortawesome/free-solid-svg-icons';
import { toPng, toJpeg } from "html-to-image";
import Dragger from "./Components/Dragger";
import MinitextMenu from "./Components/MinitextMenu";
// Initialize FontAwesome icons
library.add(faTrash, faCopy, faRotate, faLayerGroup, faExpand, faEraser);

const ResizableElement = ({ children, width, height, onResize, onResizeStart, onResizeEnd, handle }) => {
  const handleResizeStop = (e, data) => {
    e.stopPropagation();
    onResizeEnd();
    onResize(data.size);
  };

  return (
    <div className="relative">
      <ResizableBox
        width={width}
        height={height}
        lockAspectRatio={true}
        onResizeStart={(e) => {
          e.stopPropagation();
          onResizeStart();
        }}
        onResizeStop={handleResizeStop}
        minConstraints={[50, 50]}
        
        handle={handle}
      >
        {children}
      </ResizableBox>
    </div>
  );
};

const DraggableWrapper = ({ children, position, onDragStop, isRotating, isResizing }) => {
  const nodeRef = useRef(null);
  
  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={(e, data) => !isRotating && !isResizing && onDragStop(e, data)}
      disabled={isResizing || isRotating}
    >
      <div ref={nodeRef}>{children}</div>
    </Draggable>
  );
};


function App() {
// Existing state variables
const [uploadedImages, setUploadedImages] = useState([]);
const [textElements, setTextElements] = useState([]);
const [selectedElement, setSelectedElement] = useState(null);
const [isResizing, setIsResizing] = useState(false);
const [isRotating, setIsRotating] = useState(false);
const [canvasDragging, setCanvasDragging] = useState(false);

// Modified canvas position state with initial values
const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
const lastMousePosition = useRef({ x: 0, y: 0 });
//refs
const rotationStartRef = useRef({ x: 0, y: 0, rotation: 0 });
const isRotatingRef = useRef(false);
const canvasRef = useRef(null);
// Handle canvas drag start
const handleCanvasDragStart = (e) => {
  if (!canvasDragging || isResizing || isRotating) return;
  
  setIsDraggingCanvas(true);
  lastMousePosition.current = {
    x: e.clientX,
    y: e.clientY
  };
};

// Handle canvas dragging

const handleCanvasDrag = (e) => {
  if (!isDraggingCanvas || !canvasDragging) return;

  const deltaX = e.clientX - lastMousePosition.current.x;
  const deltaY = e.clientY - lastMousePosition.current.y;

  setCanvasPosition(prev => ({
    x: prev.x + deltaX,
    y: prev.y + deltaY
  }));

  lastMousePosition.current = {
    x: e.clientX,
    y: e.clientY
  };
};

// Handle canvas drag end
const handleCanvasDragEnd = () => {
  setIsDraggingCanvas(false);
};

// Add event listeners for canvas dragging
useEffect(() => {
  if (canvasDragging) {
    window.addEventListener('mousedown', handleCanvasDragStart);
    window.addEventListener('mousemove', handleCanvasDrag);
    window.addEventListener('mouseup', handleCanvasDragEnd);
  }

  return () => {
    window.removeEventListener('mousedown', handleCanvasDragStart);
    window.removeEventListener('mousemove', handleCanvasDrag);
    window.removeEventListener('mouseup', handleCanvasDragEnd);
  };
}, [canvasDragging, isDraggingCanvas]);

// Update element positions relative to canvas position
const updateElementPosition = (id, x, y, type) => {
  if (type === 'image') {
    setUploadedImages(prev =>
      prev.map(img => img.id === id ? { ...img, x, y } : img)
    );
  } else {
    setTextElements(prev =>
      prev.map(text => text.id === id ? { ...text, x, y } : text)
    );
  }
};
  // Image handling functions
  const addImage = (src) => {
    const loadImage = (dataUrl) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          });
        };
        img.onerror = reject;
        img.src = dataUrl;
      });
    };

    loadImage(src)
      .then(({width, height}) => {
        const aspectRatio = width / height;
        const baseSize = 200;
        const newImage = {
          id: Date.now(),
          type: 'image',
          src,
          x: 0,
          y: 0,
          width: baseSize,
          height: baseSize / aspectRatio,
          rotation: 0,
          aspectRatio,
          flipped: false,
          z: uploadedImages.length + textElements.length + 1
        };
        
        setUploadedImages(prev => [...prev, newImage]);
      })
      .catch(error => {
        console.error('Error loading image:', error);
      });
  };
  //canvas handling functions
  const setCanvasVar = () => {
    setCanvasDragging(!canvasDragging);
  }
  // Text handling functions
  const addTextElement = (fontinfo) => {
    const newText = {
      id: Date.now(),
      type: 'text',
      content: fontinfo.text,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      fontOutline: fontinfo.fontOutline,
      outlineColor: fontinfo.outlineColor,
      fontFamily: fontinfo.fontFamily,
      fontSize: fontinfo.fontSize,
      color: fontinfo.color,
      z: uploadedImages.length + textElements.length + 1
    };
    setTextElements(prev => [...prev, newText]);
  };

  const handleFontChange = (fontinfo) => {
    addTextElement(fontinfo);
  };

  const handleTextDoubleClick = (id, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const textElement = textElements.find(text => text.id === id);
    if (!textElement) return;
    
    const newContent = prompt('Edit text:', textElement.content);
    if (newContent !== null) {
      setTextElements(prev =>
        prev.map(text => text.id === id ? { ...text, content: newContent } : text)
      );
    }
  };

  // Common element handling functions
  const handleRotationStart = (id, type, event) => {
    event.preventDefault();
    event.stopPropagation();
      
    const element = type === 'image' 
      ? uploadedImages.find(img => img.id === id)
      : textElements.find(text => text.id === id);
    
    if (!element) return;
      
    isRotatingRef.current = true;
    setIsRotating(true);
      
    rotationStartRef.current = {
      mouseX: event.clientX,
      initialRotation: element.rotation || 0
    };
  
    const handleRotationMove = (moveEvent) => {
      if (!isRotatingRef.current) return;
      const deltaX = moveEvent.clientX - rotationStartRef.current.mouseX;
      const rotationChange = deltaX * 0.5;
      const newRotation = (rotationStartRef.current.initialRotation + rotationChange) % 360;
      
      if (type === 'image') {
        updateImageRotation(id, newRotation);
      } else {
        updateTextRotation(id, newRotation);
      }
    };
  
    const handleRotationEnd = () => {
      isRotatingRef.current = false;
      setIsRotating(false);
      document.removeEventListener('mousemove', handleRotationMove);
      document.removeEventListener('mouseup', handleRotationEnd);
    };
  
    document.addEventListener('mousemove', handleRotationMove);
    document.addEventListener('mouseup', handleRotationEnd);
  };

 
  const deleteElement = (id, type) => {
    if (type === 'image') {
      setUploadedImages(prev => prev.filter(img => img.id !== id));
    } else {
      setTextElements(prev => prev.filter(text => text.id !== id));
    }
    setSelectedElement(null);
  };

  const updateImageRotation = (id, rotation) => {
    setUploadedImages(prev =>
      prev.map(img => img.id === id ? { ...img, rotation } : img)
    );
  };

  const updateTextRotation = (id, rotation) => {
    setTextElements(prev =>
      prev.map(text => text.id === id ? { ...text, rotation } : text)
    );
  };

  const updateImageSize = (id, width, height) => {
    setUploadedImages(prev =>
      prev.map(img => img.id === id ? { ...img, width, height } : img)
    );
  };

  const updateTextSize = (id, width, height) => {
    setTextElements(prev =>
      prev.map(text => text.id === id ? { ...text, width, height } : text)
    );
  };

  const copyElement = (id, type) => {
    if (type === 'image') {
      const imageToCopy = uploadedImages.find(img => img.id === id);
      if (imageToCopy) {
        const newImage = {
          ...imageToCopy,
          id: Date.now(),
          x: imageToCopy.x + 20,
          y: imageToCopy.y + 20,
          z: uploadedImages.length + textElements.length + 1
        };
        setUploadedImages(prev => [...prev, newImage]);
      }
    } else {
      const textToCopy = textElements.find(text => text.id === id);
      if (textToCopy) {
        const newText = {
          ...textToCopy,
          id: Date.now(),
          x: textToCopy.x + 20,
          y: textToCopy.y + 20,
          z: uploadedImages.length + textElements.length + 1
        };
        setTextElements(prev => [...prev, newText]);
      }
    }
  };

  const moveBack = (id, type) => {
    if (type === 'image') {
      setUploadedImages(prev => {
        const imageIndex = prev.findIndex(img => img.id === id);
        if (imageIndex > 0) {
          const newArray = [...prev];
          const temp = newArray[imageIndex];
          newArray[imageIndex] = newArray[imageIndex - 1];
          newArray[imageIndex - 1] = temp;
          return newArray;
        }
        return prev;
      });
    } else {
      setTextElements(prev => {
        const textIndex = prev.findIndex(text => text.id === id);
        if (textIndex > 0) {
          const newArray = [...prev];
          const temp = newArray[textIndex];
          newArray[textIndex] = newArray[textIndex - 1];
          newArray[textIndex - 1] = temp;
          return newArray;
        }
        return prev;
      });
    }
  };

  const moveFront = (id, type) => {
    if (type === 'image') {
      setUploadedImages(prev => {
        const imageIndex = prev.findIndex(img => img.id === id);
        if (imageIndex < prev.length - 1) {
          const newArray = [...prev];
          const temp = newArray[imageIndex];
          newArray[imageIndex] = newArray[imageIndex + 1];
          newArray[imageIndex + 1] = temp;
          return newArray;
        }
        return prev;
      });
    } else {
      setTextElements(prev => {
        const textIndex = prev.findIndex(text => text.id === id);
        if (textIndex < prev.length - 1) {
          const newArray = [...prev];
          const temp = newArray[textIndex];
          newArray[textIndex] = newArray[textIndex + 1];
          newArray[textIndex + 1] = temp;
          return newArray;
        }
        return prev;
      });
    }
  };

  const flipImage = (id) => {
    setUploadedImages(prev =>
      prev.map(img => img.id === id ? { ...img, flipped: !img.flipped } : img)
    );
  };

  const captureScreenshot = async (format="jpeg") => {
    if (canvasRef.current) {
      try {
        const dataUrl =
        format === "jpeg"
          ? await toJpeg(canvasRef.current, { quality: 0.95 })
          : await toPng(canvasRef.current);

      // Create a link element to download the image
      const link = document.createElement("a");
      link.download = `screenshot.jpeg`;
      link.href = dataUrl;
      link.click();
    } 
    catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  }};

  return (
    <div className="relative w-screen h-screen bg-base-200">
    {/* Canvas Area */}
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div 
        className={`relative w-screen h-5/6 bg-slate-300 border border-gray-300 rounded-lg shadow-lg ${
          canvasDragging ? 'cursor-move' : ''
        }`}
        ref={canvasRef}
        style={{
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
        }}
      >
        <div className="absolute inset-0">
          {/* Render a large grid pattern for visual feedback */}
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'linear-gradient(#f0f1f0 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              width: '200%',
              height: '200%',
              left: '-50%',
              top: '-50%'
            }}
          />
          
            {/* Images */}
            {uploadedImages.map((img) => (
              <DraggableWrapper
                key={img.id}
                position={{ x: img.x, y: img.y }}
                onDragStop={(e, data) => updateElementPosition(img.id, data.x, data.y, 'image')}
                isRotating={isRotating}
                isResizing={isResizing}
                
              >
                <div 
                  className="absolute"
                  style={{ 
                    zIndex: img.z,
                    pointerEvents: isRotating ? 'none' : 'auto'
                  }}
                >
                  <ResizableElement
                    width={img.width}
                    height={img.height}
                    onResize={(size) => updateImageSize(img.id, size.width, size.height)}
                    onResizeStart={() => setIsResizing(true)}
                    onResizeEnd={() => setIsResizing(false)}
                    handle={selectedElement?.id === img.id && selectedElement?.type === 'image' ? <FontAwesomeIcon 
                    className="text-2xl cursor-pointer absolute -bottom-6 -right-6 text-blue-600 hover:text-blue-700" 
                    icon="fa-solid fa-expand" 
                  /> : <div></div>}
                  >
                    <img
                      src={img.src}
                      alt="Uploaded"
                      className="w-full h-full cursor-move select-none"
                      onClick={() => setSelectedElement({ id: img.id, type: 'image' })}
                      style={{
                        transform: `rotate(${img.rotation || 0}deg) scaleX(${img.flipped ? -1 : 1})`,
                      }}
                      draggable={false}
                    />
                  </ResizableElement>

                  {selectedElement?.id === img.id && selectedElement?.type === 'image' && (
                    <div className="absolute -top-12 left-0 bg-gray-800 rounded-lg flex items-center space-x-3 px-3 py-2 shadow-lg">
                      <button
                        className="text-red-500 hover:text-red-400 transition-colors"
                        onClick={() => deleteElement(img.id, 'image')}
                        title="Delete"
                      >
                        <FontAwesomeIcon icon="trash" className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                        onClick={() => copyElement(img.id, 'image')}
                        title="Copy"
                      >
                        <FontAwesomeIcon icon="copy" className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-green-500 hover:text-green-400 transition-colors"
                        onMouseDown={(e) => handleRotationStart(img.id, 'image', e)}
                        title="Rotate"
                      >
                        <FontAwesomeIcon icon="rotate" className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-yellow-500 hover:text-yellow-400 transition-colors"
                        onClick={() => moveBack(img.id, 'image')}
                        title="Move Back"
                      >
                        <FontAwesomeIcon icon="layer-group" className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-pink-500 hover:text-pink-400 transition-colors"
                        onClick={() => moveFront(img.id, 'image')}
                        title="Move Front"
                      >
                        <FontAwesomeIcon icon="layer-group" className="h-4 w-4 transform scale-y-[-1]" />
                      </button>
                      <button 
                        className="text-purple-500 hover:text-purple-400 transition-colors"
                        onClick={() => flipImage(img.id)}
                        title="Mirror"
                      >
                        <FontAwesomeIcon icon="rotate" className="h-4 w-4 transform scale-x-[-1]" />
                      </button>
                    </div>
                  )}
                </div>
              </DraggableWrapper>
            ))}
            

            {/* Text Elements */}
            {textElements.map((text) => (
              <DraggableWrapper
                key={text.id}
                position={{ x: text.x, y: text.y }}
                onDragStop={(e, data) => updateElementPosition(text.id, data.x, data.y, 'text')}
                isRotating={isRotating}
                isResizing={isResizing}

              >
                <div 
                  className="absolute"
                  style={{ 
                    zIndex: text.z,
                    pointerEvents: isRotating ? 'none' : 'auto'
                  }}
                >
                  <ResizableElement
                    width={text.width}
                    height={text.height}
                    onResize={(size) => updateTextSize(text.id, size.width, size.height)}
                    onResizeStart={() => setIsResizing(true)}
                    onResizeEnd={() => setIsResizing(false)}
                    handle={selectedElement?.id === text.id && selectedElement?.type === 'text' ? <FontAwesomeIcon 
                    className="text-2xl cursor-pointer absolute -bottom-6 -right-6 text-blue-600 hover:text-blue-700" 
                    icon="fa-solid fa-expand" 
                  /> : <div></div>}
                  >
                    <div
                      className="w-full h-full cursor-move select-none flex items-center justify-center"
                      style={{
                        fontFamily: text.fontFamily,
                        fontSize: `${text.fontSize}px`,
                        color: text.color,
                        WebkitTextStrokeWidth: `${text.fontOutline}px`,
                        WebkitTextStrokeColor: text.outlineColor,
                        transform: `rotate(${text.rotation || 0}deg)`,
                      }}
                      onClick={() => setSelectedElement({ id: text.id, type: 'text' })}
                      onDoubleClick={(e) => handleTextDoubleClick(text.id, e)}
                    >
                      {text.content}
                    </div>
                  </ResizableElement>

                  {selectedElement?.id === text.id && selectedElement?.type === 'text' && (
                    <div className="absolute -top-12 left-0 bg-gray-800 rounded-lg flex items-center space-x-3 px-3 py-2 shadow-lg">
                      <button
                        className="text-red-500 hover:text-red-400 transition-colors"
                        onClick={() => deleteElement(text.id, 'text')}
                        title="Delete"
                      >
                        <FontAwesomeIcon icon="trash" className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                        onClick={() => copyElement(text.id, 'text')}
                        title="Copy"
                      >
                        <FontAwesomeIcon icon="copy" className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-green-500 hover:text-green-400 transition-colors"
                        onMouseDown={(e) => handleRotationStart(text.id, 'text', e)}
                        title="Rotate"
                      >
                        <FontAwesomeIcon icon="rotate" className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-yellow-500 hover:text-yellow-400 transition-colors"
                        onClick={() => moveBack(text.id, 'text')}
                        title="Move Back"
                      >
                        <FontAwesomeIcon icon="layer-group" className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-pink-500 hover:text-pink-400 transition-colors"
                        onClick={() => moveFront(text.id, 'text')}
                        title="Move Front"
                      >
                        <FontAwesomeIcon icon="layer-group" className="h-4 w-4 transform scale-y-[-1]" />
                      </button>
                    </div>
                    
                  )}
                  {selectedElement?.id === text.id && selectedElement?.type === 'text' && (
                      <MinitextMenu  />
                    )}
                </div>
              </DraggableWrapper>
            ))}
            </div>

        </div>
        
        
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-4">
        <ImageUploader onUpload={addImage} />
      </div>
      
      <div className="absolute top-4 right-4">
        <FontMenu handleFontChange={handleFontChange} />
      </div>
      <button
        onClick={() => {
          setSelectedElement(null);
        }}
        className="absolute bottom-4 right-60 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-colors"
      >Hide UI</button>
      <button
        onClick={captureScreenshot}
        className="absolute bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-colors"
      >
        Download Screenshot
      </button>

      <div className="absolute bottom-4 left-4">
        <Dragger setCanvasDragging={setCanvasDragging} canvasDragging={canvasDragging} />
      </div>
    </div>
  );

}


export default App
