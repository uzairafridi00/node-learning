const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

mongoose.connect(
  "mongodb+srv://node-shop:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop.zjpmnqi.mongodb.net/?retryWrites=true&w=majority"
);

mongoose.Promise = global.Promise;

// It will print the logs in terminal
app.use(morgan("dev"));
// express static shows or display our files publically
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // We can restrict the API to our domain only
  //res.header("Access-Control-Allow-Origin", "https:my-site.com/");
  // res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Controle-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET"
    );
    return res.status(200).json({});
  }
  next();
});

// Routes which should Handle Request
app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);
app.use("/user", userRoutes);

// Handling request which is not in our app
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  // this will forward the error requests
  next(error);
});

// Errors thrown from any where
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
