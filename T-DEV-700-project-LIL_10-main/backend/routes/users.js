import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /users — Liste tous les utilisateurs
router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "role", "createdAt"],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /users — Ajout d’un utilisateur
router.post("/", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password are required" });

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || "employee",
    });

    res.status(201).json({
      message: "User created successfully!",
      user: { id: newUser.id, username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /users/profile — Profil de l’utilisateur connecté
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "Bienvenue sur ton profil", user: req.user });
});

export default router;
