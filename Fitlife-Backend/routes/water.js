const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Add water log for a user
router.post("/water-intake", (req, res) => {
  const { user_id, water_ml, date } = req.body;

  console.log("Received water log data:", { user_id, water_ml, date });

  // ✅ Check for missing fields
  if (!user_id || !water_ml || !date) {
    return res.status(400).json({
      error: "Missing required fields: user_id, water_ml, or date"
    });
  }

  const sql = "INSERT INTO water_intake (user_id, water_ml, date) VALUES (?, ?, ?)";

  db.query(sql, [user_id, water_ml, date], (err, result) => {
    if (err) {
      console.error("MySQL Insert Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Water logged successfully" });
  });
});

// ✅ Get past 7 days total per day for a specific user
router.get("/water-intake/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  console.log("Fetching water data for user:", user_id);

  const sql = `
    SELECT date, SUM(water_ml) AS total_water
    FROM water_intake
    WHERE user_id = ?
    GROUP BY date
    ORDER BY date ASC
    LIMIT 7
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("MySQL Select Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
