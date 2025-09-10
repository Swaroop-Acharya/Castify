import http from "http";
import { spawn } from "child_process";
import express from "express";
import { Server as SocketIO } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

const { YT_STREAM_KEY, CLIENT_ORIGIN } = process.env;
if (!YT_STREAM_KEY) {
  console.error("Missing STREAM_KEY in environment.");
  process.exit(1); // fail fast instead of running broken
}

// Add CORS middleware for Express
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

const io = new SocketIO(server, {
  cors: {
    origin: CLIENT_ORIGIN, // your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  const ffmpegOptions = [
    "-f",
    "webm",
    "-i",
    "-",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-tune",
    "zerolatency",
    "-r",
    "25",
    "-g",
    "50",
    "-keyint_min",
    "25",
    "-crf",
    "25",
    "-pix_fmt",
    "yuv420p",
    "-sc_threshold",
    "0",
    "-profile:v",
    "main",
    "-level",
    "3.1",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-ar",
    "44100",
    "-f",
    "flv",
    `rtmp://a.rtmp.youtube.com/live2/${YT_STREAM_KEY}`,
  ];

  const ffmpeg = spawn("ffmpeg", ffmpegOptions, {
    stdio: ["pipe", "inherit", "inherit"],
  });

  ffmpeg.on("error", (err) => console.error("ffmpeg spawn error:", err));
  ffmpeg.on("close", (code) => console.log(`ffmpeg exited: ${code}`));

  socket.on("binarystream", (data) => {
    const chunk = ArrayBuffer.isView(data)
      ? Buffer.from(data.buffer, data.byteOffset, data.byteLength)
      : data instanceof ArrayBuffer
        ? Buffer.from(new Uint8Array(data))
        : Buffer.isBuffer(data)
          ? data
          : Buffer.from(data);
    const ok = ffmpeg.stdin.write(chunk);
    if (!ok) {
      socket.emit("pause");
      ffmpeg.stdin.once("drain", () => socket.emit("resume"));
    }
  });

  socket.on("endstream", () => {
    console.log(`Stream ended for socket ${socket.id}`);
    if (ffmpeg && !ffmpeg.killed) {
      try {
        ffmpeg.stdin.end();   // tell ffmpeg no more input
      } catch (e) {
        console.error("Failed to end FFmpeg stdin:", e);
      }
      ffmpeg.kill("SIGINT"); // optional: forcefully stop process
    }
  });
  

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
    ffmpeg.stdin.end();
  });
});

app.get("/", (req, res) => {
  res.send("Ping pong");
});

server.listen(3000, () => console.log(`HTTP Server is runnning on PORT 3000`));
