import http from "http";
import { spawn } from "child_process";
import express from "express";
import { Server as SocketIO } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const options = [
  "-f",
  "webm", // input format (WebM chunks from browser)
  "-i",
  "-", // read from stdin
  "-c:v",
  "libx264", // re-encode video for YouTube
  "-preset",
  "ultrafast",
  "-tune",
  "zerolatency",
  "-r",
  "25", // FPS
  "-g",
  "50", // GOP size (2x FPS)
  "-keyint_min",
  "25", // keyframe interval
  "-crf",
  "25",
  "-pix_fmt",
  "yuv420p", // pixel format required by YouTube
  "-sc_threshold",
  "0",
  "-profile:v",
  "main",
  "-level",
  "3.1",
  "-c:a",
  "aac", // re-encode audio
  "-b:a",
  "128k",
  "-ar",
  "44100", // audio sample rate YouTube expects
  "-f",
  "flv", // output format
  "rtmp://a.rtmp.youtube.com/live2/{process.env.YT_STREAM_KEY}", 
];
const ffmpegProcess = spawn("ffmpeg", options);

ffmpegProcess.stdout.on("data", (data) => {
  console.log(`ffmpeg stdout: ${data}`);
});

ffmpegProcess.stderr.on("data", (data) => {
  console.error(`ffmpeg stderr: ${data}`);
});

ffmpegProcess.on("close", (code) => {
  console.log(`ffmpeg process exited with code ${code}`);
});

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  socket.on("binarystream", (stream) => {
    console.log("Binary Stream Incommming...");
    ffmpegProcess.stdin.write(Buffer.from(stream), (err) => {
      console.log("Err", err);
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
    ffmpegProcess.stdin.end(); // stop gracefully
  });
});

server.listen(3000, () => console.log(`HTTP Server is runnning on PORT 3000`));
