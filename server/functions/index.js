const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccountKey = require("./serviceAccountKey.json");

const express = require("express");
const app = express();

// Body parser for our JSON data
app.use(express.json());

// cross origin
const cors = require("cors");
app.use(cors({ origin: true }));
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

// firebase credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// api endpoints
app.get("/", (req, res) => {
  return res.send("hello word");
});

const userRoute = require("./routes/user");
app.use("/api/users", userRoute);

const productRoute = require("./routes/products");
app.use("/api/products/", productRoute);

// Swagger definition
const swaggerDefinition = {
  info: {
    title: "Your API Documentation",
    version: "1.0.0",
    description: "Documentation for your Firebase API",
  },
  basePath: "/",
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Путь к вашим файлам с API-определением
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Serve swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

exports.app = functions.https.onRequest(app);
