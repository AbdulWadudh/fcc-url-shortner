const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    originalURL: String,
    shortURL: String,
});

module.exports = mongoose.model("urlShortner", urlSchema);
