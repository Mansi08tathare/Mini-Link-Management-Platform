    const mongoose = require('mongoose');

    const clickSchema = new mongoose.Schema({
    ip: String,
    device: String,
    timestamp: { type: Date, default: Date.now },
    });

    const linkSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    remarks: { type: String, required:true },
    clickCount: { type: Number, default: 0 },
    clicks: [clickSchema],
    expirationDate: { type: Date, default: null }, // Optional expiration date
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    }, { timestamps: true });

    const Link = mongoose.model('Link', linkSchema);
    module.exports = Link;
