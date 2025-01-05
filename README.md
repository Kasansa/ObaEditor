
# ObaEditor App

The **ObaEditor App** is a React-based interactive tool that allows users to upload images, customize text, and manipulate elements on a canvas. This app includes functionality for dragging, resizing, rotating elements, and dynamically styling text using an intuitive UI.

## Features

### 1. **Image Uploading**
- Upload images from your local device.
- Display uploaded images on a customizable canvas.

### 2. **Drag, Resize, and Rotate Elements**
- Drag images and text elements to reposition them.
- Resize elements by clicking and dragging the edges.
- Rotate elements to desired angles using easy-to-use controls.

### 3. **Font Customization Menu**
- Add custom text to the canvas.
- Adjust font properties dynamically:
  - Font size, family, weight, color, and outline.
- Use color pickers to select text and outline colors.
- Preview changes in real-time before adding them to the canvas.

### 4. **Canvas Interactivity**
- Combine images and text seamlessly.
- Layer elements for a unique composition.
- Easily modify or remove elements from the canvas.

### 5. **Responsive Design**
- Fully responsive for a seamless experience on desktop and mobile devices.

---

## Tech Stack

- **React**: Frontend framework for building the user interface.
- **React Color**: Library for color pickers.
- **React Draggable**: For dragging and repositioning elements.
- **React Resizable**: For resizing components dynamically.
- **React Transformable**: For element rotation and transformations.
- **TailwindCSS** (or any preferred CSS framework): Used for styling components.

---

## Installation

### Prerequisites
- Node.js (v16 or later)
- npm or yarn package manager

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/image-text-editor.git
   cd image-text-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open the app in your browser:
   ```
   check console for url
   ```

---

## File Structure

```
src/
├── components/
│   ├── Canvas.jsx         # Canvas for placing images and text
│   ├── FontMenu.jsx       # Font customization component
│   ├── ImageUploader.jsx  # Image upload and manipulation component
│   └── Toolbar.jsx        # Toolbar for interactive features
├── App.jsx                # Main application entry point
├── index.css              # Global styles
└── index.js               # React app entry point
```

---

## Usage

1. **Upload Images**: 
   - Click the "Upload Image" button to select an image from your device.
   - The uploaded image appears on the canvas, ready for manipulation.

2. **Customize Text**:
   - Open the "Font Menu" to enter and style your text.
   - Choose font family, size, weight, color, and outline.
   - Add the text to the canvas by clicking "Add Text."

3. **Manipulate Elements**:
   - Drag: Click and drag images or text to reposition them on the canvas.
   - Resize: Adjust the size of an element by dragging its edges.
   - Rotate: Use the rotation handles to adjust the angle of any element.

4. **Layer Elements**:
   - Combine text and images by layering them interactively on the canvas.

---

## Key Dependencies

- **React**: `^18.0.0`
- **react-color**: `^2.19.3`
- **react-draggable**: `^4.4.4`
- **react-resizable**: `^1.11.0`
- **react-transformable**: `^0.8.0`

Install these dependencies by running:
```bash
npm install react react-color react-draggable react-resizable react-transformable
```

---

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes and push the branch:
   ```bash
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```
4. Create a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
