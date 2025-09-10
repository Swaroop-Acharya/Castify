import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, Radio } from "lucide-react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function Studio() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const initOnceRef = useRef(false);
  const recorderRef = useRef(null);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [isPreparingStream, setIsPreparingStream] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (initOnceRef.current) return;
      initOnceRef.current = true;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setReady(true);
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
    if (!ready || !streamRef.current) return;
    const next = !videoOn;
    streamRef.current.getVideoTracks().forEach((t) => (t.enabled = next));
    setVideoOn(next);
  };

  const toggleMic = () => {
    if (!ready || !streamRef.current) return;
    const next = !micOn;
    streamRef.current.getAudioTracks().forEach((t) => (t.enabled = next));
    setMicOn(next);
  };

  const handleOnDataAvailable = async (e) => {
    if (socket.disconnected) return;
    if (e.data && e.data.size > 0) {
      const arrayBuffer = await e.data.arrayBuffer();
      socket.emit("binarystream", new Uint8Array(arrayBuffer));
    }
  };

  const handleGoLive = () => {
    if (!streamRef.current || typeof MediaRecorder === "undefined") {
      console.log("MediaRecorder not supported or stream missing");
      return;
    }
    setIsPreparingStream(true);
    const candidates = [
      "video/webm;codecs=vp8",
      "video/webm;codecs=vp9",
      "video/webm",
    ];

    const mimeType =
      (MediaRecorder.isTypeSupported &&
        candidates.find((t) => MediaRecorder.isTypeSupported(t))) ||
      "";

    let mediaRecorder;

    try {
      mediaRecorder = new MediaRecorder(
        streamRef.current,
        mimeType ? { mimeType } : undefined,
      );
    } catch (e) {
      console.error("MediaRecorder init failed", e);
      setIsPreparingStream(false);
      return;
    }

    recorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = handleOnDataAvailable;
    mediaRecorder.onerror = (e) => console.error("MediaRecorder error:", e);
    mediaRecorder.onstart = () => {
      setIsPreparingStream(false);
      setIsLive(true);
    };
    mediaRecorder.start(1000);
  };

  const handleEndStream = () => {
    const r = recorderRef.current;
    if (r && r.state !== "inactive") {
      try {
        r.stop();
      } catch (e) {
        console.error("Recorder stop failed:", e);
      }
    }
    recorderRef.current = null;
    setIsLive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white relative">
      <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl shadow-xl overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        {isLive && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        )}
        {isPreparingStream && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-spin"></div>
            <span>PREPARING...</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-10 flex items-center space-x-6 bg-white px-6 py-3 rounded shadow-lg">
        <Button
          variant={videoOn ? "default" : "destructive"}
          onClick={toggleVideo}
          size="icon"
          disabled={!ready}
        >
          {videoOn ? (
            <Video className="h-6 w-6" />
          ) : (
            <VideoOff className="h-6 w-6" />
          )}
        </Button>

        <Button
          variant={micOn ? "default" : "destructive"}
          onClick={toggleMic}
          size="icon"
          disabled={!ready}
        >
          {micOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
        </Button>

        <Button
          variant={isLive ? "destructive" : "default"}
          size="lg"
          onClick={isLive ? handleEndStream : handleGoLive}
          disabled={
            !ready || isPreparingStream || (!isLive && !videoOn && !micOn)
          }
          className="min-w-[120px] cursor-pointer"
        >
          {isPreparingStream ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Preparing...
            </>
          ) : isLive ? (
            "End Stream"
          ) : (
            <>
              <Radio className="h-5 w-5 animate-pulse" />
              Go Live
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Studio;


