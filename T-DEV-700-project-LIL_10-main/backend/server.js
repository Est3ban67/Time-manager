import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import User from "./models/User.js";
import Clock from "./models/Clock.js";
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import clocksRoutes from "./routes/clocks.js";

dotenv.config();

const app = express();

// Configuration CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Middleware global
app.use(express.json());

// Routes principales
app.use("/api/users", usersRoutes);
app.use("/api", authRoutes);
app.use("/api/clocks", clocksRoutes);

const PORT = 5000;

// Fonction principale de démarrage du serveur
const startServer = async () => {
  try {
    // Connexion à PostgreSQL
    await sequelize.authenticate();
    console.log("Connecté à PostgreSQL avec succès !");

    // Synchronisation des tables (création/mise à jour auto)
    await sequelize.sync({ alter: true });
    console.log("Tables synchronisées avec la base de données.");

    // Lancement du serveur HTTP
    app.listen(PORT, () => {
      console.log(`Serveur en ligne sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("Erreur au démarrage du serveur :", error);
  }
};

startServer();
