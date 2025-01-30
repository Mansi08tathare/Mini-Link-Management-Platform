const express = require("express");
const router = express.Router();
const Link = require("../schema/link.schema");
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/auth.js");
const mongoose = require("mongoose");
dotenv.config();
router.get('/total-clicks', authMiddleware, async (req, res) => {
    const userId = req.user.id; 
     const userObjectId = new mongoose.Types.ObjectId(userId);

    try {
        const result = await Link.aggregate([
            { $match: { userId: userObjectId } }, // Filter by user ID
            {
                $group: {
                    _id: null,
                    totalClicks: { $sum: "$clickCount" }
                }
            }
        ]);

        const totalClicks = result.length > 0 ? result[0].totalClicks : 0;

        res.status(200).json({ status: 'success', totalClicks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

router.get('/clicks-by-device', authMiddleware, async (req, res) => {
    try {
         const userId = req.user.id; 
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const result = await Link.aggregate([
            { $match: { userId: userObjectId } }, // Only get user's links
            { $unwind: "$clicks" }, // Flatten clicks array
            {
                $group: {
                    _id: "$clicks.device",
                    totalClicks: { $sum: 1 }
                }
            }
        ]);

        const deviceClicks = {
            mobile: 0,
            desktop: 0,
            tablet: 0
        };

        result.forEach(entry => {
            if (entry._id === "mobile") deviceClicks.mobile = entry.totalClicks;
            else if (entry._id === "desktop") deviceClicks.desktop = entry.totalClicks;
            else if (entry._id === "tablet") deviceClicks.tablet = entry.totalClicks;
        });

        res.json(deviceClicks);
    } catch (error) {
        console.error("Error fetching clicks by device:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/dayWiseClick', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 3);

        const result = await Link.aggregate([
            { $match: { userId: userObjectId } }, // Only user's links
            { $unwind: "$clicks" },
            {
                $match: {
                    "clicks.timestamp": { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$clicks.timestamp" },
                        month: { $month: "$clicks.timestamp" },
                        year: { $year: "$clicks.timestamp" }
                    },
                    totalClicks: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        let cumulativeClicks = 0;
        const formattedResult = result.map(entry => {
            cumulativeClicks += entry.totalClicks;
            return {
                date: `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}-${String(entry._id.day).padStart(2, '0')}`,
                totalClicks: cumulativeClicks
            };
        });

        res.json(formattedResult);
    } catch (error) {
        console.error("Error fetching cumulative clicks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
