const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/save-health-data
router.post('/save-health-data', (req, res) => {
    const {
        name, age, gender, height, weight, smoking, exercise,
        family_history, conditions, symptoms, stress, sleep
    } = req.body;

    const sql = `
        INSERT INTO health_data
        (name, age, gender, height, weight, smoking, exercise,
         family_history, conditions, symptoms, stress, sleep)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name, age, gender, height, weight, smoking, exercise,
        Array.isArray(family_history) ? family_history.join(',') : family_history,
        Array.isArray(conditions) ? conditions.join(',') : conditions,
        Array.isArray(symptoms) ? symptoms.join(',') : symptoms,
        stress, sleep
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ Error saving health data:', err);
            return res.status(500).json({ error: 'Failed to save health data' });
        }
        res.status(200).json({ message: '✅ Health data saved successfully' });
    });
});

module.exports = router;
