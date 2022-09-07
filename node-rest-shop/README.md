# Node js Rest API

## Nodejs Setup

1. Download nodejs from its official website.
2. Then make a folder for your project and cd to it.
3. Run `npm init` inside project folder using terminal.
4. Now we need to install couple of depencies.

```bash

npm install --save express
npm install --save-dev nodemon

// For creating or using ENV Variables
npm install --save dotenv

// go to package.json file and under the scripts write this;

"start": "nodemon server.js"

// HTTP request logger middleware for node.js
npm install --save morgan

// Parsing the body of requests i.e URL and JSON bodies
npm install --save body-parser

// Parsing the form data
npm install --save multer

// Encrypting the Password to Store in Database
npm install --save bcrypt

// Library to do Token generation and Signature durin Auth Process
npm install --save jsonwebtoken

// Dot Env File
npm install --save dotenv
```

# Setting DOT ENV FILE

1. Create file at root directory with `.env` name.
2. When you want to access these variables use `process.env.JWT_KEY` etc.

```js
JWT_KEY = "your secret paste here";
MONGO_ATLAS_PW: "your mongodb password here";
```

---

## Routes

1. Make seperate folder for api/routes/AllYourRoutesHere.
2. It will be easy for to easily manage your code.

#### app.js file

```js
const express = require("express");
const app = express();

const productRoutes = require("./api/routes/products");

app.use("/products", productRoutes);

module.exports = app;
```

#### Products Route file

```js
const express = require("express");
const router = express.Router();

// Here we will don't put /products route again because it is already define in app.js
// If we put /products here again then our URL will  become /products/products/something
// which will give error
router.get("/");
```

#### Passing Params to Get Method

```js
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  if (id === "special") {
    res.status(200).json({
      message: "You discovered the special ID",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "You passed an ID",
    });
  }
});
```

---

## Error Handling + Logging Data

1. HTTP request logger middleware for node.js
   `npm install --save morgan`

```js
const express = require("express");
const app = express();
const morgan = require("morgan");

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "It works",
//   });
// });

// It will print the logs in terminal
app.use(morgan("dev"));

app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);

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
```

---

## Body Parser

1. `npm install --save body-parser`
2. It does not support file but it does support URL Encoded, bodies and it also support JSON data.

## CORS Errors

1. CORS stands for Cross-Origin Resource Sharing and it is a security concept.
2. When your client and server is on same server that is `localhost:3000` then it will succeed.
3. In the REST API it's not the case. It has different URL or different origins. Even the port number is different for
   client and server. We need to send Headers to our browser to avoid CORS errors.

```js
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
```

---

# MONGODB and MOONGOOSE

1. MongoDB is a database and Mongoose is a package to work with Database.
2. MongoDB Atlas is also MongoDB database but it is managed on Cloud by company.
3. Enterprise Advanced is also a MongoDB database but it will be installed on your local machine or server.
4. Install mongose `npm install --save mongoose`.

```js
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://node-shop:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop.zjpmnqi.mongodb.net/?retryWrites=true&w=majority",
  {
    useMongoClient: true,
  }
);
```

5. Create nodemon.json file and store the `ENV Variables`.

```json
{
  "env": {
    "MONGO_ATLAS_PW": "node-shop"
  }
}
```

6. Now we will define Schema or Model which will be contructor to build objects in Database.
7. For doing this make seperate folder in `api/models/products` and in that folder define your schemas.

```js
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
});

module.exports = mongoose.model("Product", productSchema);
```

8. Now go back to Routers file and import your schema for POST request.

```js
const mongoose = require("mongoose");
const Product = require("../models/products");

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
```

#### GET METHOD WITH MONGODB

```js
const Product = require("../models/products");

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No Valid Entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
```

#### GET ALL

```js
const Product = require("../models/products");

// Return All objects Here
router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
```

#### DELETE METHOD of MONGOOSE

```js
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
```

#### UPDATE METHOD of MONGOOSE

```js
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne(
    { _id: id },
    {
      $set: { name: updateOps }
        .exec()
        .then((result) => {
          console.log(result);
          res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        }),
    }
  );
});
```

---

## Mongoose Validation

1. We can now define validation on our schemas.

```js
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
```

---

## Passing Meta Data in RESTFul API

1. Passing meta-data and counting the docs and mapping it.

```js
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
```

```js
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + doc._id,
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No Valid Entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Updated Successfully",
        updatedProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "PATCH",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Deleted Successfully",
        deletedProduct: {
          result: {
            type: "DELETE",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
```

---

# Orders Schema

1. Now we will make a Schema for Order of products.
2. We will make relation of Product document with Orders document, in order to know which product is
   ordered.

```js
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Order", orderSchema);
```

---

## Populating another Product Doc in Orders Route

1. We can populate or get info of other document using only its id and display it.
2. `.populate("product")`

```js
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET ALL",
              url: "localhost:3000/orders/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
```

---

# UPLOADING AN IMAGE

1. `npm install --save multer` is simply a package which parse form data.
2. It is alternative to `body parser` which parse the URL and JSON bodies.
3. Multer parse `req.body` and `req.file` both which submit in FORM data.
4. Below is the configuration of Multer.

```js
const multer = require("multer");

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
```

5. Now Update the Model

```js
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
```

6. Now the POST METHOD

```js
router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created Product Successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "POST",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
```

7. Now give access to file to publically available.

```js
app.use("/uploads", express.static("uploads"));
```

---

# Authentication

1. RESTful API is stateless which don't save login info, we can't use sessions in this, instead we use tokens.
2. Client `Send Auth Data` and Server responds with `Token`.
3. This `token` can be used by client in Storage for future Auth.

### What's that Token ?

1. The Token is `JSON Web Token` because it is simply a JSON object where we stored user Email and signature.
2. `JSON Data + Signature = JSON Web Token (JWT)`.

### Creating Authentication

1. In order to craete Auth, we first need to make `user model`.

```js
// User Model
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true.valueOf,
    match:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
```

2. Now create `users.js` route file.
3. For Encrypting or hashing `passwords` field we need to install package ->
   `npm install --save bcrypt`.

```js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

// POST route to Create New User -> /signup
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail Already Exists. Try Different One.",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User Created Succesfully",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

// LOGIN METHOD
router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed.",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        if (result) {
          return res.status(200).json({
            message: "Auth Successful",
          });
        }
        res.status(401).json({
          message: "Auth Failed.",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
```

---

## Adding User Login & JWT Signing

1. Now we need to return token with our API when user get logged in.
2. We need to install library `npm install --save jsonwebtoken`.

```js
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed.",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth Successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth Failed.",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
```

---

# JWT Route Protection

1. Make a new file in `api/middleware` to define your middlewares for your app.
2. Create a file `check-auth.js`.
3. `jwt.verify()` method verifies our token.

```js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Auth Failed",
    });
  }
};
```

4. Now Protecting the Route

```js
const checkAuth = require("../middleware/check-auth");

router.post("/", checkAuth, upload.single("productImage"), (req, res, next) => {
  // ALL THE POST METHOD CODE
});
```

5. Now we need to send the token to verify in form data, but that is not the correct method.
6. Send the data in HEADERS, `Authorization: Bearer YOUR_TOKEN` and `Content-Type: application/json`.

---

# Adding Controllers

1. Now if we look to our route files they are big.
2. Now we will distribute our logic to `Controllers` file.
3. By adding `Controllers` we are close to `MVC` structure but of course `View` is missing because we are creating RESTful Services.
4. Make folder in `api/controllers`.

```js
// Import all the libraries
exports.products_get_all = // ALL YOUR LOGIC

```

5. In routes files simply import Controller and call it.

```js
const ProductController = require("../controllers/products");

router.get("/", ProductController.products_get_all);
```

---
