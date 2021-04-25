const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
var errorhandler = require("errorhandler");

const postsRoutes = require("./routes/posts");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("uploaded-images")));

if (process.env.NODE_ENV !== "production") {
  app.use(errorhandler({ dumpExceptions: true, showStack: true }));
} else {
  app.use(errorhandler());
}

// MongoDB connection
const username =
  process.env.NODE_ENV === "production"
    ? encodeURIComponent(process.env.MONGO_USERNAME)
    : encodeURIComponent("meanuser");
const password =
  process.env.NODE_ENV === "production"
    ? encodeURIComponent(process.env.MONGO_PASSWORD)
    : encodeURIComponent("Aa123456.");
const clusterUrl =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : "localhost:27017/mean-demo-db";
const uri = `mongodb://${username}:${password}@${clusterUrl}`;

console.log(clusterUrl);
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((error) => {
    console.log("Failed to connect database!", { Error: error });
  });

// Router configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
