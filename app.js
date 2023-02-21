const dotenv = require("dotenv");
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

// Configure ENV file & Connection with DB
dotenv.config({ path: "./config.env" });
require("./db/conn");
const port = process.env.PORT;
//

// Require Model

const Users = require("./models/userSchema");
const Message = require("./models/msgSchema");
const authenticate = require("./middleware/authenticate");

// These methods used to get data & cookies from Front-End

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Registration
app.post("/register", async (req, res) => {
  try {
    //Get body of data
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const createUser = new Users({
      username: username,
      email: email,
      password: password,
    });

    const created = await createUser.save();
    console.log(created);
    res.status(200).send("Registered");
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    //Fint if users exists or not
    const user = await Users.findOne({ email: email });
    if (user) {
      //verify Password
      const isMatch = await bcryptjs.compare(password, user.password);
      if (isMatch) {
        // Generate Token
        const token = await user.generateToken();
        res.cookie("jwt", token, {
          // Expire Token in 24 hours
          expires: new Date(Date.now() + 86400000),
          httpOnly: true,
        });
        res.status(200).json(user);
      } else {
        res.status(400).send("Invalid Credentials");
      }
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
// Message
app.post("/message", async (req, res) => {
  try {
    //Get body of data
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    const sendMsg = new Message({
      name: name,
      email: email,
      message: message,
    });

    const created = await sendMsg.save();
    console.log(created);
    res.status(200).send("Sent");
  } catch (error) {
    res.status(400).send(error);
  }
});
/// Logout Page
app.get("/logout", (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  res.status(200).send("User Logged Out");
});
// Authentication
app.get("/auth", authenticate, (req, res) => {});

app.listen(port, () => {
  console.log("Server is Listning to PORT: 3001");
});
