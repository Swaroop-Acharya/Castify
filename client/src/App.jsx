import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, Radio } from "lucide-react";

function App() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const initOnceRef = useRef(false);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const init = async () => {

      if(initOnceRef.current)return;
      initOnceRef.current=true;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    init();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoOn;
    }
    setVideoOn((prev) => !prev);
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !micOn;
    }
    setMicOn((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white relative">
      {/* Video Preview */}
      <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl shadow-xl overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        {/* LIVE Badge */}
        {live && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full shadow-lg animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="text-white text-sm font-semibold">LIVE</span>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-10 flex items-center space-x-6 bg-white px-6 py-3 rounded shadow-lg">
        {/* Video Button */}
        <Button
          variant={videoOn ? "default" : "destructive"}
          onClick={toggleVideo}
          size="icon"
        >
          {videoOn ? (
            <Video className="h-6 w-6" />
          ) : (
            <VideoOff className="h-6 w-6" />
          )}
        </Button>

        {/* Mic Button */}
        <Button
          onClick={toggleMic}
          size="icon"
          variant={micOn ? "default" : "destructive"}
        >
          {micOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
        </Button>

        {/* Go Live */}
        <Button
          size="lg"
          onClick={() => setLive(!live)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 flex items-center space-x-2"
        >
          <Radio className="h-5 w-5 animate-pulse" />
          <span>Go Live</span>
        </Button>
      </div>
    </div>
  );
}

export default App;
