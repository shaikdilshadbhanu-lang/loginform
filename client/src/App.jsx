import React, { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";

      const response = await fetch(
        `http://localhost:5000/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);

        if (data.token) {
          if (remember) {
            localStorage.setItem("token", data.token);
          } else {
            sessionStorage.setItem("token", data.token);
          }
        }

        if (isLogin) {
          setForm({
            name: "",
            email: "",
            password: ""
          });
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(
        "Backend server is not running. Please start the backend."
      );
    }

    setLoading(false);
  }

  function guestLogin() {
    setForm({
      name: "",
      email: "guest@example.com",
      password: "guest123"
    });
    setIsLogin(true);
  }

  return (
    <div className="page">

      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      <div className="login-container">

        <div className="left-section">

          <div className="brand">
            <div className="brand-icon">✦</div>
            <span>DILSHAD</span>
          </div>

          <div className="welcome">

            <span className="small-title">
              ✨ WELCOME TO NOVASPACE
            </span>

            <h1>
              Build your
              <span> future.</span>
            </h1>

            <p>
              Sign in and continue your journey with a
              beautiful, secure and powerful experience.
            </p>

            <div className="features">

              <div className="feature">
                <div className="feature-icon">⚡</div>
                <div>
                  <h3>Fast & Simple</h3>
                  <p>Lightning-fast authentication.</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">🔐</div>
                <div>
                  <h3>Secure</h3>
                  <p>Your account stays protected.</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">🚀</div>
                <div>
                  <h3>Ready to Grow</h3>
                  <p>Everything you need in one place.</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        <div className="right-section">

          <div className="form-card">

            <div className="form-header">

              <div className="user-icon">
                {isLogin ? "👋" : "🚀"}
              </div>

              <h2>
                {isLogin ? "Welcome Back!" : "Create Account"}
              </h2>

              <p>
                {isLogin
                  ? "Enter your details to continue"
                  : "Join NovaSpace today"}
              </p>

            </div>

            <div className="tabs">

              <button
                className={isLogin ? "active" : ""}
                onClick={() => {
                  setIsLogin(true);
                  setMessage("");
                }}
              >
                Login
              </button>

              <button
                className={!isLogin ? "active" : ""}
                onClick={() => {
                  setIsLogin(false);
                  setMessage("");
                }}
              >
                Sign Up
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {!isLogin && (
                <div className="input-group">
                  <label>Full Name</label>

                  <div className="input-box">
                    <span>👤</span>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="input-group">

                <label>Email Address</label>

                <div className="input-box">
                  <span>✉️</span>

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="input-group">

                <label>Password</label>

                <div className="input-box">

                  <span>🔒</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="eye"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>

                </div>

              </div>

              {isLogin && (
                <div className="options">

                  <label className="remember">

                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) =>
                        setRemember(e.target.checked)
                      }
                    />

                    <span>Remember me</span>

                  </label>

                  <button
                    type="button"
                    className="forgot"
                    onClick={() =>
                      alert(
                        "Password reset feature can be connected to email service."
                      )
                    }
                  >
                    Forgot Password?
                  </button>

                </div>
              )}

              {message && (
                <div className="message">
                  {message}
                </div>
              )}

              <button
                className="main-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In →"
                  : "Create Account →"}
              </button>

            </form>

            <div className="divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <div className="social-buttons">

              <button
                onClick={() =>
                  alert("Google authentication can be connected here.")
                }
              >
                <span>G</span>
                Google
              </button>

              <button
                onClick={() =>
                  alert("GitHub authentication can be connected here.")
                }
              >
                <span>◉</span>
                GitHub
              </button>

            </div>

            <button
              className="guest-button"
              onClick={guestLogin}
            >
              👤 Continue as Guest
            </button>

            <p className="bottom-text">

              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                }}
              >
                {isLogin ? " Create one" : " Login"}
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;