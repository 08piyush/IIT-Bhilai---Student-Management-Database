const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const functions = require("./controller/functions.js");
const middleware = require("./middleware/middleware.js");
const crypto = require("./middleware/crypto.js");
const cors = require("cors");
const path = require('path');
const port = 3000;

app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    // console.log("res : ", res);
    res.setHeader('Content-Type', 'application/javascript');
    console.log('Content-Type middleware executed');
  }
  next();
});

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login" , function(req,res) {
  res.render("login");
});

app.get("/student/add", function (req, res) {
  res.render("add_student");
});

app.get("/student/delete", function (req, res) {
  console.log("rendering delete function :");
  res.render("del_student");
});

app.get("/show_student", function (req, res) {
  res.render("show_student");
});

app.get("/update_student", function (req, res) {
  res.render("update_student");
});

// middleware.validateToken,
app.post(
  "/show_students",
  functions.getUsers
);
app.post("/student/delete", functions.deleteUser);
// app.get('/student/:studentid',middleware.validateToken, functions.getUserById);
app.post("/student/add", functions.createUser);
app.post('/student/update', functions.updateUser);
// app.delete('/student/empty',middleware.validateToken, functions.deleteAll);
// app.delete('/student/:studentid', middleware.validateToken, functions.deleteUser);
app.get("/studentANDsubject/join", functions.getjoin);
app.get("/student/subject/:studentid", functions.getsubjects);
app.post("/login", middleware.login);
app.get("/validateToken", middleware.validateToken);
app.post("/admin/register", middleware.register);
app.put(
  "/authenticate/changePassword",
  middleware.validateToken,
  middleware.changePass
);
app.post(
  "/forgotPassword",
  middleware.validateToken,
  middleware.forgotPassword
);
app.post(
  "/resetPassword",
  middleware.validateResetToken,
  middleware.resetToken
);

app.listen(process.env.PORT || port, () => {
  console.log(`App running on port ${port}.`);
});






