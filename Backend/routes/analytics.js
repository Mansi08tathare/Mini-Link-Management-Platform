const express = require('express');
const router = express.Router();
const Link = require('../schema/link.schema');
const authMiddleware = require('../middleware/auth');
router.get('/getLinks', authMiddleware, async (req, res) => {
    const { limit, offset } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);
    const userId = req.user.id; // Get the logged-in user's ID

    if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid limit value' });
    }

    if (isNaN(parsedOffset) || parsedOffset < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid offset value' });
    }

    try {
        // Fetch only links that belong to the logged-in user
        const userLinks = await Link.find({ userId });

        // Calculate the total number of clicks for this user
        const totalClicks = userLinks.reduce((sum, link) => sum + link.clicks.length, 0);

        // Flatten the user's clicks into an array with details
        const allClicks = userLinks.flatMap(link =>
            link.clicks.map(click => ({
                timestamp: click.timestamp.toLocaleString(),
                originalLink: link.originalUrl,
                shortLink: link.shortUrl,
                ipAddress: click.ip,
                userDevice: click.device,
            }))
        );

        // Apply pagination
        const paginatedClicks = allClicks.slice(parsedOffset, parsedOffset + parsedLimit);

        return res.status(200).json({
            status: "success",
            data: paginatedClicks,
            totalLinks: userLinks.length,
            totalClicks: totalClicks,
            limit: parsedLimit,
            offset: parsedOffset,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

module.exports = router;