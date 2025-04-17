const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());



app.use(
  cors({
    origin: "*", // Allow requests from this origin

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (if required)
  })
);

app.options("*", cors());

// Welcome route
app.get("/", (req, res) => {
  return res.status(200).send({ message: "Welcome Nike" });
});

const login = require("./src/Route/LoginRoute")
app.use(login)


module.exports = app;
