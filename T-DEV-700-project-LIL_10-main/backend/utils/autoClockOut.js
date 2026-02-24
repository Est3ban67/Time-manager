import { Op } from "sequelize";
import Clock from "../models/Clock.js";

export const autoClockOut = async () => {
  try {
    const now = new Date();
    const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);

    const openClocks = await Clock.findAll({
      where: {
        status: "open",
        checkIn: { [Op.lt]: eightHoursAgo },
      },
    });

    if (openClocks.length === 0) {
      console.log("Aucune clock ouverte depuis plus de 8h.");
      return;
    }

    for (const clock of openClocks) {
      clock.checkOut = now;
      clock.status = "closed";
      await clock.save();
      console.log(
        `Auto clock-out appliqué pour userId=${clock.userId} (id=${clock.id})`,
      );
    }

    console.log(`${openClocks.length} clocks ont été fermées automatiquement.`);
  } catch (error) {
    console.error("Erreur lors de l'auto clock-out :", error);
  }
};
