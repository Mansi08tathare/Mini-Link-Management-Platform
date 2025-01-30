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
            { $match: { userId: userObjectId } }, // Filter links for the user
            { $unwind: "$clicks" }, // Flatten the clicks array
            {
                $group: {
                    _id: "$clicks.device",
                    totalClicks: { $sum: 1 }
                }
            }
        ]);

        // Define a mapping function for categorizing devices
        const categorizeDevice = (device) => {
            const mobileDevices = ["mobile", "phone", "android", "iphone"];
            const desktopDevices = ["desktop", "bot", "mac", "windows"];
            const tabletDevices = ["tablet", "ipad"];

            if (mobileDevices.includes(device.toLowerCase())) return "mobile";
            if (desktopDevices.includes(device.toLowerCase())) return "desktop";
            if (tabletDevices.includes(device.toLowerCase())) return "tablet";
            return "other";
        };

        // Initialize device click counters
        const deviceClicks = {
            mobile: 0,
            desktop: 0,
            tablet: 0
        };

        // Process result and categorize devices
        result.forEach(entry => {
            const category = categorizeDevice(entry._id);
            if (category in deviceClicks) {
                deviceClicks[category] += entry.totalClicks;
            }
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
