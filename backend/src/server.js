import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import { initMQTT } from "./mqtt/mqttClient.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);

app.get("/", (req, res) => res.json({ status: "Smart Home API running" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

initMQTT(io);

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));