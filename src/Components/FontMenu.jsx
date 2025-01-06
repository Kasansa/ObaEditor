import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

const FontMenu = ({ handleFontChange }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontOutline, setFontOutline] = useState(0);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [color, setColor] = useState('#000000');
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [fontWeight, setFontWeight] = useState(400);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showOutlineColorPicker, setShowOutlineColorPicker] = useState(false);
  const [showTextMenu, setShowTextMenu] = useState(false);

  const fontFamilies = [
    'Arial',
    'Times New Roman',
    'Helvetica',
    'Georgia',
    'Verdana',
    'Courier New',
    'Comic Sans MS',
  ];

  const fontWeights = [
    { value: 100, label: 'Thin' },
    { value: 400, label: 'Regular' },
    { value: 600, label: 'Semi Bold' },
    { value: 700, label: 'Bold' },
    { value: 900, label: 'Black' },
  ];

  const handleAddText = () => {
    if (text.trim()) {
      handleFontChange({
        text,
        fontSize,
        fontFamily,
        color,
        fontWeight,
        fontOutline,
        outlineColor,
      });
      setText(''); // Clear the text input after adding
    }
  };

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow-sm shadow-slate-400 lg:w-80 sm:w-40">
      <button
        onClick={() => setShowTextMenu(!showTextMenu)}
        className="btn lg:w-full text-white py-2 px-4 rounded mb-4 sm:w-10"
      >
        {showTextMenu ? 'Hide Text Menu' : 'Show Text Menu'}
      </button>
      {showTextMenu && (
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="w-full p-2 mb-4 border rounded"
          />

          <div className="mb-4">
            <label className="block text-sm mb-1">Font Size: {fontSize}px</label>
            <input
              type="range"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Font Outline: {fontOutline}px</label>
            <input
              type="range"
              min="0"
              max="12"
              value={fontOutline}
              onChange={(e) => setFontOutline(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Font Weight</label>
            <select
              value={fontWeight}
              onChange={(e) => setFontWeight(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {fontWeights.map((weight) => (
                <option key={weight.value} value={weight.value}>
                  {weight.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Font Color</label>
            <div
              className="w-full h-8 border rounded cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <div className="absolute z-10">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowColorPicker(false)}
                />
                <SketchPicker
                  color={color}
                  onChange={(color) => setColor(color.hex)}
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Outline Color</label>
            <div
              className="w-full h-8 border rounded cursor-pointer"
              style={{ backgroundColor: outlineColor }}
              onClick={() => setShowOutlineColorPicker(!showOutlineColorPicker)}
            />
            {showOutlineColorPicker && (
              <div className="absolute z-10">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowOutlineColorPicker(false)}
                />
                <SketchPicker
                  color={outlineColor}
                  onChange={(color) => setOutlineColor(color.hex)}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleAddText}
            className="w-full btn bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add Text
          </button>

          {/* Preview */}
          <div className="mt-4 p-2 border rounded">
            <p className="text-sm mb-1">Preview:</p>
            <span
              style={{
                fontFamily,
                fontSize: `${fontSize}px`,
                color,
                fontWeight,
                WebkitTextStrokeWidth: `${fontOutline}px`,
                WebkitTextStrokeColor: outlineColor,
              }}
            >
              {text || 'Sample Text'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontMenu;
