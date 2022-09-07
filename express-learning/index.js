// require("dotenv").config;
const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

// This app has bunch of useful methods
// app.get();
// app.put();
// app.post();
// app.delete();

const courses = [
  { id: 1, name: "Course 1" },
  { id: 2, name: "Course 2" },
  { id: 3, name: "Course 3" },
  { id: 4, name: "Course 4" },
];

app.get("/", (req, res) => {
  res.send("Hello Express World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send("The course not found");
  res.send(course);
});

app.get("/api/class/:id", (req, res) => {
  res.send(req.query);
});

// POST Method

app.post("/api/courses", (req, res) => {
  // Validate
  // If invalid, return 400 - Bad Request
  // const result = validateCourse(req.body);
  const { error } = validateCourse(req.body);
  if (error) {
    // 400 Bad Requests
    res.status(400).send(error);
    return; // When you want the function to be end here
  }

  // const { error, value } = schema.validate({ a: 'a string' });

  // console.log(result)

  // if (result.error) {
  //   // 400 Bad Requests
  //   res.status(400).send(result.error);
  //   return; // When you want the function to be end here
  // }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

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

app.delete("/api/courses/:id", (req, res) => {
  // Lookup the Course
  // If not exist, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course not found");
    return;
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

const port = process.env.PORT || 3000;
// app.set('port', process.env.PORT || 3000);
app.listen(port, () => console.log(`Listening on port ${port}....`));
