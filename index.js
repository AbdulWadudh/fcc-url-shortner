require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const shortId = require("shortid");
const bodyParser = require("body-parser");
const validURL = require('valid-url');

const URLShortnerModel = require("./models/urlShortner");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res) => {
  const originalUrl = req.body.url;
  const urlId = shortId.generate();
  
  if (validURL.isWebUri(originalUrl) === undefined) {
    res.json({ error: 'Invalid URL' });
  } else {
    try {
      let findOneUrl = await URLShortnerModel.findOne({ originalURL: originalUrl }).lean();
      if (findOneUrl) {
        res.json({
          original_url: findOneUrl.originalURL,
          short_url: findOneUrl.shortURL,
        });
      } else {
        findOneUrl = new URLShortnerModel({
          originalURL: originalUrl,
          shortURL: urlId,
        });

        findOneUrl = await findOneUrl.save();

        res.json({
          original_url: findOneUrl.originalURL,
          short_url: findOneUrl.shortURL,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  try {
    const getUrlToRedirect = await URLShortnerModel.findOne({ shortURL: req.params.short_url }).lean();

    if (getUrlToRedirect) {
      return res.redirect(getUrlToRedirect?.originalURL);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
