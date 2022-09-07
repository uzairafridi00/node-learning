const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");

// POST route to Create New User -> /signup
router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.delete("/:userId", UserController.delete_user);

module.exports = router;
