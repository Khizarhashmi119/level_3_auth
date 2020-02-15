const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/level3DB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("user", userSchema);

app.route("/").get((req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username: username }, (err, result) => {
      if (!err) {
        if (result) {
          if (result.password === md5(password)) {
            res.render("secret");
          } else {
            res.render("result", {
              message: "Incorrect password."
            });
          }
        } else {
          res.render("result", {
            message: "Not registered! Registered yourself."
          });
        }
      } else {
        console.log(err);
        res.render("result", {
          message: "Error! Please try again after sometime."
        });
      }
    });
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
      username: username,
      password: md5(password)
    });
    newUser.save().then(() => {
      res.render("result", {
        message: "Woohu! Successfully registered."
      });
    });
  });

app.listen(3000, () => {
  console.log("Server has been started at port no. 3000.");
});
