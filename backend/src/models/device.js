import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    room: { type: String, default: "Unassigned" },
    type: { type: String, enum: ["socket", "switch"], default: "socket" },
    topic: { type: String, required: true, unique: true },
    state: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);m