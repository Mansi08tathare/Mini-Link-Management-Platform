const express= require("express");
const router = express.Router();
const links = require("../schema/link.schema")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const authMiddleware = require("../middleware/auth");

dotenv.config()

router.post('/create', authMiddleware, async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { originalUrl, remarks, expirationDate } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ status: 'error', message: 'Original URL is required' });
    }

    // Encrypt the original URL using bcrypt
    const saltRounds = 10;
    const hashedUrl = await bcrypt.hash(originalUrl, saltRounds);
    const shortUrlId = hashedUrl.replace(/\//g, '').substring(0, 10);

    const newLink = new links({
        originalUrl,
        remarks,
        expirationDate,
        userId: req.user.id,  // Use authenticated user's ID
        shortUrl: shortUrlId,
    });

    await newLink.save();

    const backendUrl = process.env.BACKEND_URL || 'https://mini-link-management-platform-8fhy.onrender.com';
    const fullShortUrl = `${backendUrl}/${shortUrlId}`;

    res.status(201).json({
        status: 'success',
        message: 'Link created successfully',
        data: {
            originalUrl: newLink.originalUrl,
            shortUrl: fullShortUrl,
            remarks: newLink.remarks,
            expirationDate: newLink.expirationDate,
        },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/linksByRemarks', authMiddleware, async (req, res) => {
  const { remarks } = req.query; // Get remarks from query parameter

  if (!remarks) {
      return res.status(400).json({ status: 'error', message: 'Remarks query parameter is required' });
  }

  try {
      // Find links that match the provided remarks and belong to the logged-in user
      const linksByRemarks = await links.find({
          remarks: { $regex: remarks, $options: 'i' },  // Case-insensitive search
          userId: req.user.id  // Ensure the link belongs to the logged-in user
      });

      if (linksByRemarks.length === 0) {
          return res.status(404).json({ status: 'error', message: 'No links found with the specified remarks' });
      }

      res.status(200).json({
          status: 'success',
          data: linksByRemarks,
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


  router.get('/getLinks', authMiddleware, async (req, res) => {
    const { limit, offset } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);

    if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid limit value' });
    }

    if (isNaN(parsedOffset) || parsedOffset < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid offset value' });
    }

    try {
        // Fetch the user's links
        const link = await links.find({ userId: req.user.id })  // Only fetch links for the logged-in user
            .skip(parsedOffset)
            .limit(parsedLimit);

        if (link.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No links found' });
        }

        res.status(200).json({
            status: 'success',
            data: link,
            total: await links.countDocuments({ userId: req.user.id }), // Count only user's links
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});
router.put('/editLink/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { originalUrl, remarks, expirationDate } = req.body;

  if (!originalUrl) {
      return res.status(400).json({ status: 'error', message: 'Original URL is required' });
  }

  try {
      const existingLink = await links.findById(id);

      if (!existingLink) {
          return res.status(404).json({ status: 'error', message: 'Link not found' });
      }

      if (existingLink.userId.toString() !== req.user.id) {  // Ensure the user is editing their own link
          return res.status(403).json({ status: 'error', message: 'You can only edit your own links' });
      }

      const saltRounds = 10;
      const hashedUrl = await bcrypt.hash(originalUrl, saltRounds);
      const shortUrlId = hashedUrl.replace(/\//g, '').substring(0, 10);

      const updatedData = {
          originalUrl,
          remarks,
          expirationDate,
          shortUrl: shortUrlId,
      };

      const updatedLink = await links.findByIdAndUpdate(id, updatedData, { new: true });

      const backendUrl = process.env.BACKEND_URL || 'https://mini-link-management-platform-8fhy.onrender.com';
      const fullShortUrl = `${backendUrl}/${shortUrlId}`;

      res.status(200).json({
          status: 'success',
          message: 'Link updated successfully',
          data: {
              originalUrl: updatedLink.originalUrl,
              shortUrl: fullShortUrl,
              remarks: updatedLink.remarks,
              expirationDate: updatedLink.expirationDate,
          },
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.delete('/deleteLink/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
      const link = await links.findById(id);

      if (!link) {
          return res.status(404).json({ status: 'error', message: 'Link not found' });
      }

      if (link.userId.toString() !== req.user.id) {  // Ensure the user is deleting their own link
          return res.status(403).json({ status: 'error', message: 'You can only delete your own links' });
      }

      await links.findByIdAndDelete(id);

      res.status(200).json({
          status: 'success',
          message: 'Link deleted successfully',
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

  

  module.exports = router;