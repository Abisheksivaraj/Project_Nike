const express = require("express");
const cors = require("cors");

const app = express();


// Increase the limit for JSON requests
app.use(express.json({ limit: '200mb' }));

// If you're also using URL-encoded requests, increase that limit too
app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.use(
  cors({
    origin: "*", 
    // origin:"https://fairwayenterprises-xthl.onrender.com",

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

const login = require("./src/Route/LoginRoute");
const defectType = require("./src/Route/DefectRoute");
const colorCode = require("./src/Route/ColorCodeRoute")
const person = require("./src/Route/EmployeeRoute")
const dashboardCount = require("./src/Route/DefectIdentifyRoute")
app.use(login);
app.use(defectType);
app.use(colorCode);
app.use(person);
app.use(dashboardCount);


module.exports = app;
