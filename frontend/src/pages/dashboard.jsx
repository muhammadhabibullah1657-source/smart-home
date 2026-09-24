import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  getDevices,
  addDevice,
  toggleDevice,
  deleteDevice,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

/* ---------- SVG Icons ---------- */
const LogoIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" width="52" height="52">
    <path
      d="M15 45 L50 15 L85 45"
      stroke="#3b82f6"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25 42 L25 80 L75 80 L75 42"
      stroke="#3b82f6"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M38 48 Q38 36 50 36 Q62 36 62 48"
      stroke="#3b82f6"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M43 52 Q43 45 50 45 Q57 45 57 52"
      stroke="#3b82f6"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="50" cy="57" r="3" fill="#3b82f6" />
  </svg>
);

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3b82f6"
    strokeWidth="1.8"
    width="22"
    height="22"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round" />
  </svg>
);

const PlugIcon = ({ color = "#3b82f6", size = 22 }) => (
  <svg
    viewBox="0 0 24 24"
    fill={color}
    width={size}
    height={size}
  >
    <path d="M9 2v6H7V2H5v6c0 2.21 1.79 4 4 4v10h2V12c2.21 0 4-1.79 4-4V2h-2v6h-2V2H9z" />
  </svg>
);

const BulbIcon = ({ color = "#facc15", size = 22 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
  >
    <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V18h8v-3.3A7 7 0 0012 2z" />
  </svg>
);

const HomeNavIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    fill={active ? "#3b82f6" : "none"}
    stroke={active ? "#3b82f6" : "#64748b"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="22"
    height="22"
  >
    <path d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z" />
  </svg>
);

const SettingsNavIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? "#3b82f6" : "#64748b"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="22"
    height="22"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9v.09a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

/* ---------- Toggle Switch ---------- */
function Toggle({ on, onClick }) {
  return (
    <div
      className={`toggle-switch ${on ? "on" : "off"}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="toggle-knob" />
    </div>
  );
}

/* ---------- Device Card Component ---------- */
function DeviceCard({ device, onToggle, onDelete }) {
  const isSocket = device.type === "socket";
  return (
    <div className="modern-card">
      <div className="card-icon-wrap">
        <span className="card-emoji">{isSocket ? "🔌" : "💡"}</span>
      </div>
      <h4 className="card-name">{device.name}</h4>
      <p className="card-room">{device.room}</p>
     <div className="card-bottom">
  <Toggle on={device.state} onClick={() => onToggle(device._id)} />
  <span className={`card-state ${device.state ? "on" : "off"}`}>
    {device.state ? "ON" : "OFF"}
  </span>
  <button
    className="card-delete"
    onClick={() => onDelete(device._id)}
    title="Delete"
  >
    ×
  </button>
     </div>
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [newDevice, setNewDevice] = useState({
    name: "",
    room: "",
    type: "socket",
  });

  const fetchDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDevices();
    const socket = io("http://localhost:5000");
    socket.on("device-update", (updated) => {
      setDevices((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d))
      );
    });
    return () => socket.disconnect();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addDevice(newDevice);
    setNewDevice({ name: "", room: "", type: "socket" });
    setShowForm(false);
    fetchDevices();
  };

  const handleToggle = async (id) => {
    await toggleDevice(id);
    fetchDevices();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this device?")) return;
    await deleteDevice(id);
    fetchDevices();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sockets = devices.filter((d) => d.type === "socket");
  const switches = devices.filter((d) => d.type === "switch");

  return (
    <div className="app-dashboard">
      {/* ===== Top Header ===== */}
      <header className="app-header">
        <div className="app-brand">
          <LogoIcon />
          <div className="brand-text">
            <h1>
              Smart <span className="brand-accent">Home</span>
            </h1>
            <p>Control · Monitor · Live Better</p>
          </div>
        </div>
        <button className="avatar-btn" onClick={handleLogout} title="Logout">
          {initials}
        </button>
      </header>

      {/* ===== Home Tab ===== */}
      {activeTab === "Home" && (
        <>
          {/* Greeting */}
          <section className="greeting-section">
            <div>
              <h2 className="greeting-title">
                Welcome Back,
                <br />
                <span className="greeting-name">
                  {user?.name?.split(" ")[0] || "User"}
                </span>{" "}
                👋
              </h2>
              <p className="greeting-sub">Your home is connected</p>
            </div>
            <div className="status-pill">
              <span className="dot"></span> Online
            </div>
          </section>

          {/* Sockets Section */}
          <section className="device-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon socket">
                  <PlugIcon />
                </span>
                <h3>Sockets</h3>
              </div>
              <button
                className="view-all"
                onClick={() => setActiveTab("Sockets")}
              >
                View all ›
              </button>
            </div>
            <div className="device-row">
              {sockets.length === 0 && (
                <p className="empty-text">
                  No sockets yet. Tap + to add one.
                </p>
              )}
              {sockets.map((d) => (
                <DeviceCard
                  key={d._id}
                  device={d}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>

          {/* Switches Section */}
          <section className="device-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon switch">
                  <BulbIcon />
                </span>
                <h3>Switches</h3>
              </div>
              <button
                className="view-all"
                onClick={() => setActiveTab("Switches")}
              >
                View all ›
              </button>
            </div>
            <div className="device-row">
              {switches.length === 0 && (
                <p className="empty-text">
                  No switches yet. Tap + to add one.
                </p>
              )}
              {switches.map((d) => (
                <DeviceCard
                  key={d._id}
                  device={d}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ===== Sockets Tab ===== */}
      {activeTab === "Sockets" && (
        <section className="device-section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon socket">
                <PlugIcon />
              </span>
              <h3>All Sockets</h3>
            </div>
          </div>
          <div className="device-row">
            {sockets.map((d) => (
              <DeviceCard
                key={d._id}
                device={d}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
            {sockets.length === 0 && (
              <p className="empty-text">No sockets yet.</p>
            )}
          </div>
        </section>
      )}

      {/* ===== Switches Tab ===== */}
      {activeTab === "Switches" && (
        <section className="device-section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon switch">
                <BulbIcon />
              </span>
              <h3>All Switches</h3>
            </div>
          </div>
          <div className="device-row">
            {switches.map((d) => (
              <DeviceCard
                key={d._id}
                device={d}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
            {switches.length === 0 && (
              <p className="empty-text">No switches yet.</p>
            )}
          </div>
        </section>
      )}

      {/* ===== Settings Tab ===== */}
      {activeTab === "Settings" && (
        <section className="device-section">
          <h2 className="greeting-title" style={{ marginBottom: 24 }}>
            Settings
          </h2>

          <div className="settings-block">
            <div className="settings-row">
              <span>Account</span>
              <span className="settings-value">{user?.email}</span>
            </div>
            <div className="settings-row">
              <span>Total Devices</span>
              <span className="settings-value">{devices.length}</span>
            </div>
            <div className="settings-row">
              <span>Devices Online</span>
              <span className="settings-value">
                {devices.filter((d) => d.online).length}
              </span>
            </div>
          </div>

          <button className="logout-full-btn" onClick={handleLogout}>
            Logout
          </button>
        </section>
      )}

      {/* ===== Floating Add Button ===== */}
      <button
        className="floating-add"
        onClick={() => setShowForm(!showForm)}
        title="Add device"
      >
        {showForm ? "×" : "+"}
      </button>

      {/* ===== Add Device Modal ===== */}
      {showForm && (
        <div className="add-overlay" onClick={() => setShowForm(false)}>
          <form
            className="add-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAdd}
          >
            <h3>Add New Device</h3>
            <input
              placeholder="Device name (e.g. Living Room Socket)"
              value={newDevice.name}
              onChange={(e) =>
                setNewDevice({ ...newDevice, name: e.target.value })
              }
              required
              autoFocus
            />
            <input
              placeholder="Room (e.g. Living Room)"
              value={newDevice.room}
              onChange={(e) =>
                setNewDevice({ ...newDevice, room: e.target.value })
              }
              required
            />
            <div className="type-select">
              <button
                type="button"
                className={`type-option ${
                  newDevice.type === "socket" ? "active" : ""
                }`}
                onClick={() =>
                  setNewDevice({ ...newDevice, type: "socket" })
                }
              >
                🔌 Socket
              </button>
              <button
                type="button"
                className={`type-option ${
                  newDevice.type === "switch" ? "active" : ""
                }`}
                onClick={() =>
                  setNewDevice({ ...newDevice, type: "switch" })
                }
              >
                💡 Switch
              </button>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save Device
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== Bottom Navigation ===== */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === "Home" ? "active" : ""}`}
          onClick={() => setActiveTab("Home")}
        >
          <HomeNavIcon active={activeTab === "Home"} />
          <span>Home</span>
        </button>

        <button
          className={`nav-item ${activeTab === "Sockets" ? "active" : ""}`}
          onClick={() => setActiveTab("Sockets")}
        >
          <PlugIcon
            color={activeTab === "Sockets" ? "#3b82f6" : "#64748b"}
            size={22}
          />
          <span>Sockets</span>
        </button>

        <button
          className={`nav-item ${activeTab === "Switches" ? "active" : ""}`}
          onClick={() => setActiveTab("Switches")}
        >
          <BulbIcon
            color={activeTab === "Switches" ? "#3b82f6" : "#64748b"}
            size={22}
          />
          <span>Switches</span>
        </button>

        <button
          className={`nav-item ${activeTab === "Settings" ? "active" : ""}`}
          onClick={() => setActiveTab("Settings")}
        >
          <SettingsNavIcon active={activeTab === "Settings"} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}
