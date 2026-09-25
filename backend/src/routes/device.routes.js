import express from "express";
import auth from "../middleware/auth.js";
import Device from "../models/device.js";
import { publishCommand } from "../mqtt/mqttClient.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const devices = await Device.find({ owner: req.userId });
  res.json(devices);
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, room, type } = req.body;
    const topic = `smarthome/${req.userId}/${Date.now()}`;
    const device = await Device.create({
      owner: req.userId,
      name,
      room,
      type,
      topic,
    });
    res.json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/toggle", auth, async (req, res) => {
  const device = await Device.findOne({ _id: req.params.id, owner: req.userId });
  if (!device) return res.status(404).json({ message: "Not found" });

  device.state = !device.state;
  await device.save();

  publishCommand(device.topic, device.state ? "ON" : "OFF");
  res.json(device);
});

router.delete("/:id", auth, async (req, res) => {
  await Device.deleteOne({ _id: req.params.id, owner: req.userId });
  res.json({ success: true });
});

export default router;