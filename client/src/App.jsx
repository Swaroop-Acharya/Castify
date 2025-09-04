
import { useRef } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";
function App() {
  const videoRef = useRef(null);

  const handleClick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if(videoRef.current){
         videoRef.current.srcObject=stream;
    }
  };

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <video ref={videoRef} width="500" height="500" autoPlay playsInline></video>
        <Button onClick={handleClick}>Start</Button>
      </div>
    </>
  );
}

export default App;
