# node-learning

## Express js

1. Express is a light weight, fast and properly documented framework of Nodejs.
   A framework gives structure to your application.

2. Initiating Express App

```bash
mkdir APP_NAME
cd APP_NAME
npm init --yes
npm i express

```

### First Web Server

```js
const express = require("express");
const app = express();

// This app object has a bunch of useful methods

app.get();
app.post();
app.put();
app.delete();
```

### app.get()

1. This method get two arguments.
2. The first arg is path or url and second arg is call back function.
3. This call back function has two args i.e req & res

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => console.log("Listening on port 3000"));
```

4. In terminal type `node index.js or fileName.js` to run the code.
5. Now go to browser and type `localhost:3000` in url bar.

#### Another Example

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3]);
});

app.listen(3000, () => console.log("Listening on port 3000"));
```

### Note

1. With this structure as our application grows we can move some of the routes to different files.
2. We can move all the routes of courses to seperate file like `Courses.js`.

## NODEMON

1. It's very tideous to run or compile your code again and again.
2. Install package Nodemon (Node Monitor) globally to access from anywhere.

```bash
npm i -g nodemon

```

3. Now we use nodemon to watch our code.

```bash
nodemon fileName.js

```

---

## Environment Variables

1. One thing is to improve in the code is the hard coded value for port.
2. When you deploy the app on hosting environment, the port is dynamically assigned.
3. The way to fix is to use env variable `PORT`.
4. We can access the Enviroment variables using `process.env.ANY_VARIABLE`.
5. Now we will set the ENV_VARS. `npm i dotenv`
6. Make a `.env` file and store your Variables.

---

## Route Parameters

1. Now we will get the data using parameters like `/api/courses/1`.

```js
app.get("/api/courses/:id", (req, res) => {
  res.send(req.params.id);
});
```

2. Also we can use query paramters.

```js
app.get("/api/class/:id", (req, res) => {
  res.send(req.query);
});

// /api/course/1?sortBy=name
// ?sortBy=name is Query parameter
```

---

## Handling GET Requests

```js
const courses = [
  { id: 1, name: "Course 1" },
  { id: 2, name: "Course 2" },
  { id: 3, name: "Course 3" },
  { id: 4, name: "Course 4" },
];

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The course not found");
  res.send(course);
});
```

---

## Handling POST Requests

1. Test this POST method on POSTMAN app. Install it in Chrome as an extension.
2. Change the HTTP method to POST and provide your api `http://localhost:3000/api/courses` (in my case).
3. Now in body section pass the string value.
4. You will see the status code 200 which means that has been created.

```js
// POST Method

app.post("/api/courses", (req, res) => {
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});
```

---

## Input Validation

1. Input validation is done to avoid crashing of your app and for security reasons.

```js
// POST Method

app.post("/api/courses", (req, res) => {
  if (!req.body.name || req.body.name.length < 3) {
    // 400 Bad Requests
    res.status(400).send("Name is required and should be min of 3 characters");
    return; // When you want the function to be end here
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});
```

2. It will be difficult and time consuming to write complex validations for your real world app.
3. You can use `joi` which is npm package to apply custom validations.

### JOI

1. The most powerful schema description language and data validator for JavaScript.
2. `npm i joi`.
3. In `Joi` firt we define schema which is the shape of object, type of object etc.
4. For More schema variations read the docs `https://joi.dev/api/`.

```js
const Joi = require("joi");
```

---

### Handling Put Requests

```js
app.put("/api/courses/:id", (req, res) => {
  // Lookup the Course
  // If not exist, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The course not found");

  // Validate
  // If invalid, return 400 - Bad Request
  // const result = validateCourse(req.body);
  const { error } = validateCourse(req.body);
  if (error) {
    // 400 Bad Requests
    res.status(400).send(error);
    return; // When you want the function to be end here
  }

  // Update course
  course.name = req.body.name;
  // Return Update course to client
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required,
  });
  return schema.validate(course.body);
}
```
