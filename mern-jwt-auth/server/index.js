const express = require("express")

const app = express()

PORT = 4000
app.listen(PORT, () => {
    console.log(`Server Started on PORT ${PORT}`)
})