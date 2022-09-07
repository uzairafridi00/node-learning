const mongoose = require("mongoose");

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.DB);
    console.log("Connected to DB Successfully");
  } catch (error) {
    console.log(error);
    console.log("Connection ERROR");
  }
};
