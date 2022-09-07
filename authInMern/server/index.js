require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const connection = require("./db");
const userRoutes = require("./api/routes/user");
const authRoutes = require("./api/routes/auth");

// Database
connection();

// middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Defining PORT
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening in PORT ${port}...`));
