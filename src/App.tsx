import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Pdf2Image from "./Pdf2Image";

function App() {
  const [img, setImg] = useState("");

  const convertPDFToBase64Image = async (e: any) => {
    try {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const pdf2image = await Pdf2Image.open(url);

      const images = await pdf2image.getAllImageDataUrl({
        width: 400,
        height: 400,
      });

      setImg(images[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <img src={img} alt="fetched" />

        <input
          type="file"
          name="upload"
          accept="application/pdf,application/vnd.ms-excel"
          onChange={convertPDFToBase64Image}
        />
      </header>
    </div>
  );
}

export default App;
