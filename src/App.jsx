import React, { useState, useRef, useEffect, useCallback } from "react";
import ImageUploader from "./Components/ImageUploader";
import FontMenu from "./Components/FontMenu";
import { ResizableBox } from "react-resizable";
import Draggable from "react-draggable";
import "react-resizable/css/styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faCopy, faRotate, faLayerGroup, faEraser, faExpand } from '@fortawesome/free-solid-svg-icons';
import html2canvas from "html2canvas";
import { fabric } from 'fabric';

// Initialize FontAwesome icons
library.add(faTrash, faCopy, faRotate, faLayerGroup, faExpand, faEraser);

const ResizableElement = ({ children, width, height, onResize, onResizeStart, onResizeEnd }) => {
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
        maxConstraints={[500, 500]}
        handle={
          <FontAwesomeIcon 
            className="text-2xl cursor-pointer absolute -bottom-6 -right-6 text-blue-600 hover:text-blue-700" 
            icon="fa-solid fa-expand" 
          />
        }
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
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  
  const rotationStartRef = useRef({ x: 0, y: 0, rotation: 0 });
  const canvasRef = useRef(null);
  const isRotatingRef = useRef(false); // Add this ref to track rotation state

  const handleRotationStart = (id, event) => {
    event.preventDefault();
    event.stopPropagation();
      
    const image = uploadedImages.find(img => img.id === id);
    if (!image) return;
      
    isRotatingRef.current = true;
    setIsRotating(true);
      
    // Store initial mouse position and current rotation
    rotationStartRef.current = {
      mouseX: event.clientX,
      initialRotation: image.rotation || 0
    };
  
    const handleRotationMove = (moveEvent) => {
      if (!isRotatingRef.current) return;
        
      // Calculate how far mouse has moved horizontally
      const deltaX = moveEvent.clientX - rotationStartRef.current.mouseX;
      
      // Convert pixel movement to degrees (you can adjust the scaling factor)
      const rotationChange = deltaX * 0.5; // Each pixel = 0.5 degrees
      
      // Calculate new rotation
      const newRotation = (rotationStartRef.current.initialRotation + rotationChange) % 360;
      
      updateImageRotation(id, newRotation);
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
          src,
          x: 0,
          y: 0,
          width: baseSize,
          height: baseSize / aspectRatio,
          rotation: 0,
          aspectRatio,
          flipped: false,
          z: 1
        };
        
        setUploadedImages(prev => [...prev, newImage]);
      })
      .catch(error => {
        console.error('Error loading image:', error);
      });
  };

  const updateImageRotation = (id, rotation) => {
    setUploadedImages(prev =>
      prev.map(img => img.id === id ? { ...img, rotation } : img)
    );
  };

  const updateImagePosition = (id, x, y) => {
    setUploadedImages(prev =>
      prev.map(img => img.id === id ? { ...img, x, y } : img)
    );
  };

  const updateImageSize = (id, width, height) => {
    setUploadedImages(prev =>
      prev.map(img => img.id === id ? { ...img, width, height } : img)
    );
  };

  const handleImageClick = (id) => {
    setSelectedImage(id === selectedImage ? null : id);
  };

  const deleteImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
    setSelectedImage(null);
  };

  const copyImage = (id) => {
    const imageToCopy = uploadedImages.find(img => img.id === id);
    if (imageToCopy) {
      const newImage = {
        ...imageToCopy,
        id: Date.now(),
        x: imageToCopy.x + 20,
        y: imageToCopy.y + 20,
        zIndex: uploadedImages.length
      };
      setUploadedImages(prev => [...prev, newImage]);
    }
  };

  const moveBack = (id) => {
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
  };

  const moveFront = (id) => {
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
  };

  const flipImage = (id) => {
    setUploadedImages(prev =>
      prev.map(img => img.id === id ? { ...img, flipped: !img.flipped } : img)
    );
    
  };

  const captureScreenshot = async () => {
    if (canvasRef.current) {
      try {
        const canvas = await html2canvas(canvasRef.current);
        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Error capturing screenshot:', error);
      }
    }
  };

  return (
    <div className="relative w-screen h-screen bg-base-200">
      {/* Canvas Area */}
      <div className="absolute inset-0 flex items-center justify-center" ref={canvasRef}>
        <div className="relative w-3/4 h-3/4 bg-slate-300 border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          {/* Uploaded Images */}
          {uploadedImages.map((img) => (
            <DraggableWrapper
              key={img.id}
              position={{ x: img.x, y: img.y }}
              onDragStop={(e, data) => updateImagePosition(img.id, data.x, data.y)}
              isRotating={isRotating}
              isResizing={isResizing}
              style={{
                zIndex: img.z
              }}
            >
              <div 
                className="absolute"
                style={{ 
                  
                  pointerEvents: isRotating ? 'none' : 'auto'
                }}
              >
                <ResizableElement
                  width={img.width}
                  height={img.height}
                  onResize={(size) => updateImageSize(img.id, size.width, size.height)}
                  onResizeStart={() => setIsResizing(true)}
                  onResizeEnd={() => setIsResizing(false)}
                >
                  <img
                    src={img.src}
                    alt="Uploaded"
                    className="w-full h-full cursor-move select-none"
                    onClick={() => handleImageClick(img.id)}
                    style={{
                      transform: `rotate(${img.rotation || 0}deg) scaleX(${img.flipped ? -1 : 1})`,
                    }}
                  />
                </ResizableElement>

                {selectedImage === img.id && (
                  <div className="absolute -top-12 left-0 bg-gray-800 rounded-lg flex items-center space-x-3 px-3 py-2 shadow-lg">
                    <button
                      className="text-red-500 hover:text-red-400 transition-colors"
                      onClick={() => deleteImage(img.id)}
                      title="Delete"
                    >
                      <FontAwesomeIcon icon="trash" className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-blue-500 hover:text-blue-400 transition-colors"
                      onClick={() => copyImage(img.id)}
                      title="Copy"
                    >
                      <FontAwesomeIcon icon="copy" className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-green-500 hover:text-green-400 transition-colors"
                      onMouseDown={(e) => handleRotationStart(img.id, e)}
                      title="Rotate"
                    >
                      <FontAwesomeIcon icon="rotate" className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-yellow-500 hover:text-yellow-400 transition-colors"
                      onClick={() => moveBack(img.id)}
                      title="Move Back"
                    >
                      <FontAwesomeIcon icon="layer-group" className="h-4 w-4 " />
                    </button>
                    <button 
                      className="text-pink-500 hover:text-pink-400 transition-colors"
                      onClick={() => moveFront(img.id)}
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
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-4">
        <ImageUploader onUpload={addImage} />
      </div>
      
      <div className="absolute top-4 right-4">
        <FontMenu onFontChange={handleFontChange} />
      </div>
      
      <button
        onClick={captureScreenshot}
        className="absolute bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-colors"
      >
        Download Screenshot
      </button>
    </div>
  );
}

export default App;