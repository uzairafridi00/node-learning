const express = require("express")
const cors = require("cors")

const app = express()

PORT = 4000
app.listen(PORT, () => {
    console.log(`Server Started on PORT ${PORT}`)
})

app.use(cors({
    // Change the URL according to your Front-End website where it is hosted
    origin:["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}))

// This would have access to JSON data in the API request 
app.use(express.json())