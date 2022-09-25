const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config()

const app = express();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});

mongoose
  .connect(
    "mongodb+srv://auther:" + process.env.MONGO_PW + "@auther.oqtyoub.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.Promise = global.Promise;

app.use(
  cors({
    // Change the URL according to your Front-End website where it is hosted
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// This would have access to JSON data in the API request
app.use(express.json());
