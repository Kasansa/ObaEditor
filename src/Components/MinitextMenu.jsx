import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const MinitextMenu = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");
  const [outlineColor, setOutlineColor] = useState("#ffffff");

  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  return (
    <div className="relative inline-block">
      {/* Editable Text Element */}
      

      {/* Font Awesome Icon */}
      <FontAwesomeIcon
        icon={faEdit}
        className="ml-2 text-lg text-blue-500 cursor-pointer"
        onClick={toggleMenu}
      />

      {/* Mini Text Menu */}
      {isMenuVisible && (
        <div className="absolute bg-base-100 top-full mt-2 w-64  shadow-md border rounded-lg p-4 z-10">
          {/* Font Size Slider */}
          <div className="mb-4">
            <label className="block mb-2 text-xs ">
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="range range-primary"
            />
          </div>

          {/* Text Color Picker */}
          <div className="mb-4">
            <label className="block mb-2 text-xs">Text Color:</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full border rounded-md h-10"
            />
          </div>

          {/* Background Color Picker */}
          <div>
            <label className="block mb-2 text-xs">
              Outline Color:
            </label>
            <input
              type="color"
              value={outlineColor}
              onChange={(e) => setOutlineColor(e.target.value)}
              className="w-full border rounded-md h-10"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MinitextMenu;
