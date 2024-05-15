import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import React, { useRef } from 'react';
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from 'react-webcam';
import './App.css';
import { drawMesh } from './utilities';

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFacemesh = async () =>{
    const net = await facemesh.load({
      inputResolution:{width:640, height:480, scale:0.8}
    })
    setInterval(()=>{
      detect(net)
    }, 100)
  }

  const detect = async(net)=>{
    if(typeof webcamRef.current !=="undefined" && webcamRef.current !== null && webcamRef.current.video.readyState===4)
  {
    // get vid properties
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth
    const videoHeight = webcamRef.current.video.videoHeight
    //set vid width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;
    //set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    //make detections
    const face = await net.estimateFaces(video);
    console.log(face);
    //get canvas context for drawing
    const ctx = canvasRef.current.getContext("2d");
    drawMesh(face, ctx)

  }
}
  runFacemesh();

  return (
    <div className='App'>
      <header className='App Header'>
      <Webcam ref={webcamRef} style={
        {
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:640,
          height:480
        }
      }></Webcam>
      <canvas ref={canvasRef} style={
        {
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:640,
          height:480
        }
      }></canvas></header>
    </div>

  );
}

export default App;
