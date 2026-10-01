const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();

const PORT = 5000;

const JWT_SECRET = "NOVASPACE_SECRET_2026";

app.use(cors());
app.use(express.json());

const USERS_FILE = "./users.json";

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, "[]");
}

function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(users, null, 2)
  );
}

/* =========================
   REGISTER
========================= */

app.post("/api/auth/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters."
      });
    }

    const users = getUsers();

    const existingUser = users.find(
      user =>
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered."
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    saveUsers(users);

    res.status(201).json({
      message: "Account created successfully! 🎉"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error."
    });

  }

});


/* =========================
   LOGIN
========================= */

app.post("/api/auth/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const users = getUsers();

    const user = users.find(
      user =>
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    res.json({
      message: `Welcome back, ${user.name}! 🎉`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error."
    });

  }

});


/* =========================
   PROTECTED PROFILE
========================= */

app.get("/api/profile", (req, res) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No authentication token."
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    res.json({
      message: "Authentication successful.",
      user: decoded
    });

  } catch (error) {

    res.status(401).json({
      message: "Invalid or expired token."
    });

  }

});


/* =========================
   SERVER
========================= */

app.listen(PORT, () => {

  console.log(
    `🚀 Backend running on http://localhost:${PORT}`
  );

});