import express from "express";
import Clock from "../models/Clock.js";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { Op } from "sequelize";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

const router = express.Router();

/**
 * POST /api/clock/
 * Create or update a clock entry for a specific date.
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      date,
      checkInMorning,
      checkOutMorning,
      checkInAfterNoon,
      checkOutAfterNoon,
    } = req.body;
    const userId = req.user.id;

    const clockDate = await Clock.findOne({ where: { userId, date } });

    if (clockDate) {
      await Clock.update(
        {
          checkInMorning: checkInMorning || clockDate.checkInMorning,
          checkOutMorning: checkOutMorning || clockDate.checkOutMorning,
          checkInAfterNoon: checkInAfterNoon || clockDate.checkInAfterNoon,
          checkOutAfterNoon: checkOutAfterNoon || clockDate.checkOutAfterNoon,
        },
        {
          where: { userId, date },
        },
      );
      return res.status(200).json({
        message: "Clock entry updated successfully!",
        status: 200,
      });
    } else {
      await Clock.create({
        userId,
        date,
        checkInMorning: checkInMorning || null,
        checkOutMorning: checkOutMorning || null,
        checkInAfterNoon: checkInAfterNoon || null,
        checkOutAfterNoon: checkOutAfterNoon || null,
      });
      return res.status(201).json({
        message: "Clock entry created successfully!",
        status: 201,
      });
    }
  } catch (error) {
    console.error("Clock error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/clock/
 * Find a clock entry for a specific user and date.
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const date = req.query.date?.toString();
    const userId = req.user.id;

    const clock = await Clock.findOne({ where: { userId, date } });
    return clock
      ? res.json({ data: clock, status: 200 })
      : res.json({ message: "Clock entry not found", status: 404 });
  } catch (error) {
    console.error("Clock fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/clocks/clock-in
 * Enregistre l'arrivée d'un utilisateur.
 */
router.post("/clock-in", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Empêche de pointer deux fois sans clock-out
    const openClock = await Clock.findOne({
      where: { userId, checkOut: null },
    });
    if (openClock) {
      return res.status(400).json({
        error: "You already have an active clock-in. Please clock out first.",
      });
    }

    const newClock = await Clock.create({
      userId,
      checkIn: new Date(),
      checkOut: null,
    });

    res.status(201).json({
      message: "Clock-in recorded successfully!",
      clock: newClock,
    });
  } catch (error) {
    console.error("Clock-in error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/clocks/clock-out
 * Ferme le dernier enregistrement ouvert (checkOut = now).
 */
router.post("/clock-out", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const openClock = await Clock.findOne({
      where: { userId, checkOut: null },
      order: [["checkIn", "DESC"]],
    });

    if (!openClock) {
      return res
        .status(400)
        .json({ error: "No open clock-in found to clock out." });
    }

    openClock.checkOut = new Date();
    await openClock.save();

    // Calcul automatique de la durée travaillée (optionnel)
    const workedHours =
      (new Date(openClock.checkOut) - new Date(openClock.checkIn)) /
      (1000 * 60 * 60);

    res.json({
      message: "Clock-out recorded successfully!",
      workedHours: workedHours.toFixed(2),
      clock: openClock,
    });
  } catch (error) {
    console.error("Clock-out error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
