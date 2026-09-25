import mqtt from "mqtt";
import dotenv from "dotenv";
import Device from "../models/device.js";

dotenv.config();

let client;
let socketIO;

export function initMQTT(io) {
  socketIO = io;

  client = mqtt.connect(process.env.MQTT_BROKER);

  client.on("connect", () => {
    console.log("✅ MQTT connected");
    client.subscribe("smarthome/+/+/status");
  });

  client.on("message", async (topic, message) => {
    const payload = message.toString();
    const device = await Device.findOne({ topic: topic.replace("/status", "") });
    if (!device) return;

    device.state = payload === "ON";
    device.online = true;
    device.lastSeen = new Date();
    await device.save();

    socketIO.emit("device-update", device);
  });

  client.on("error", (err) => console.error("MQTT error:", err));
}

export function publishCommand(topic, command) {
  if (!client) return;
  client.publish(`${topic}/command`, command);
}