const express = require("express");
const router = express.Router();
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");

const ProductController = require("../controllers/products");

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

// Multer Defining Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // accept a file
    cb(null, true);
  } else {
    // reject a file
    cb(null, false);
  }
};

// Multer Configuration
const upload = multer({
  storage: storage,
  limits: {
    // Accept 5mb file
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// All the ROUTES
router.get("/", ProductController.products_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.products_create_product
);

router.get("/:productId", ProductController.products_get_product);

router.patch(
  "/:productId",
  checkAuth,
  ProductController.products_update_product
);

router.delete(
  "/:productId",
  checkAuth,
  ProductController.products_delete_product
);

module.exports = router;
