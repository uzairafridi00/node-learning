const express = require("express");
var cors = require('cors')
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors())

app.get("/api", (req,res) => {
    res.json({message:"Hello from Server!"})
})

app.get("/api/hello", (req,res) => {
  res.json({message:"Hello from Server from /api/hello!"})
})


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
