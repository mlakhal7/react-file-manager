require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();

// enable files upload - form multipart data
app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

//Définition des CORS
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Testing
app.get("/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/api/world", (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
});

// Controllers
var browserController = require(__dirname + "/controllers/browseController");
app.use("/browse", browserController);

var downloadController = require(__dirname + "/controllers/downloadController");
app.use("/download", downloadController);

var uploadController = require(__dirname + "/controllers/uploadController");
app.use("/upload", uploadController);

var removeController = require(__dirname + "/controllers/removeController");
app.use("/remove", removeController);

// Deployment
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
