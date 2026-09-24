import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = isRegister
        ? await registerUser(form)
        : await loginUser({ email: form.email, password: form.password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="login-content">
        {/* --- Logo --- */}
        <div className="logo-container">
          <svg
            className="logo-icon"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
              d="M35 55 Q35 42 50 42 Q65 42 65 55"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M42 55 Q42 48 50 48 Q58 48 58 55"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="50" cy="60" r="4" fill="#3b82f6" />
          </svg>

          <h1 className="brand-title">
            Smart <span className="brand-accent">Home</span>
          </h1>
          <p className="brand-tagline">
            Control <span className="dot">·</span> Monitor{" "}
            <span className="dot">·</span> Live Better
          </p>
        </div>

        {/* --- Form --- */}
        <div className="login-form-section">
          <h2 className="welcome-title">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="welcome-subtitle">
            {isRegister
              ? "Sign up to get started"
              : "Sign in to access your smart home"}
          </p>

          <form className="modern-form" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="input-group">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="input-group">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                placeholder="Email or Phone Number"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="input-group">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {!isRegister && (
              <div className="form-extras">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  Remember me
                </label>
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>
            )}

            <button type="submit" className="primary-btn">
              {isRegister ? "Create Account" : "Login"}
            </button>
          </form>

          {!isRegister && (
            <div className="divider">
              <span>OR</span>
            </div>
          )}

          <button
            className="ghost-btn"
            onClick={() => setIsRegister(!isRegister)}
            style={{ marginTop: isRegister ? 20 : 0 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="btn-icon"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            {isRegister ? "Back to Sign In" : "Create an Account"}
          </button>
        </div>
      </div>
    </div>
  );
}