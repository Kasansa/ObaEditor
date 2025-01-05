import React from 'react'

function ImageUploader({ onUpload }) {
    const handleUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          onUpload(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <div className="my-4">
        <label className="btn cursor-pointer  bg-blue-500 text-white py-2 px-4 rounded">
          Upload Image
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>
    );
  }
  

export default ImageUploader