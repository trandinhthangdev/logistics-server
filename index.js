// app.js
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("./routes");
const { corsOptions } = require("./utils/cors");
const app = express();

// Middleware
app.use(bodyParser.json());

app.use(cors(corsOptions));

// Connect to MongoDB
const mongoDBUri =
    "mongodb+srv://tonytran99no1:thang08021999@cluster0.obsqoff.mongodb.net/"; // Replace 'mydatabase' with your database name
mongoose.connect(mongoDBUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Use the routes defined in routes.js
app.use("/", route);
// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
