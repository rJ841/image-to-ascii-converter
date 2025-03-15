import React, { useState, useRef } from "react";
import './App.css';

function App() {
  const [asciiArt, setAsciiArt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const asciiRef = useRef(null);

  const convertToAscii = (imageFile) => {
    setLoading(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = URL.createObjectURL(imageFile);
    img.onload = () => {
      const width = 80;
      const height = Math.floor((img.height / img.width) * width * 0.5);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      const asciiChars = "@%#*+=-:. ";
      let asciiString = "";

      for (let i = 0; i < pixels.length; i += 4) {
        const grayscale = pixels[i] * 0.3 + pixels[i + 1] * 0.59 + pixels[i + 2] * 0.11;
        const index = Math.floor((grayscale / 255) * (asciiChars.length - 1));
        asciiString += asciiChars[index];
        if ((i / 4) % width === width - 1) asciiString += "\n";
      }

      setAsciiArt(asciiString);
      setLoading(false);
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      convertToAscii(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(asciiArt).then(() => alert("Copied to clipboard!"));
  };

  const downloadAscii = () => {
    const blob = new Blob([asciiArt], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ascii-art.txt";
    link.click();
  };

  return (
    <div className="container">
      <h2>
        <span role="img" aria-label="icon">🖼️</span> Image to ASCII Converter
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input"
      />

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
        </div>
      )}

      <div className="buttons">
        <button onClick={copyToClipboard} disabled={!asciiArt}>📋 Copy</button>
        <button onClick={downloadAscii} disabled={!asciiArt}>⬇ Download</button>
      </div>

      {loading && <div className="loading">⏳ Converting to ASCII...</div>}

      {asciiArt && (
        <pre ref={asciiRef} className="ascii-output">{asciiArt}</pre>
      )}
    </div>
  );
}

export default App;
