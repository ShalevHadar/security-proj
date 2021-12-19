const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv');
const verifyToken = require("./auth");
const https = require('https');
const fs = require('fs');
const path = require('path');
dotenv.config();
const config = process.env;

const Port = config.PORT;

const sslServer = https.createServer(
    {
        key: fs.readFileSync('./cert/key.pem') ,
        cert: fs.readFileSync('./cert/cert.pem') ,
    },
    app
)

const Login = require("./routes/login");
const Register = require("./routes/register");
const AddNote = require("./routes/addNote");
const Search = require("./routes/search");
const RemoveNote = require("./routes/removeNote");
const Changepass = require("./routes/changepass");
const Forgotpass = require("./routes/forgotpass");
const Resetpass = require("./routes/resetpass");

app.use(cors())

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: config.DB_PASSWORD,
    database: "security-project"
})

// app.listen(Port, function () {
//     console.log(`Server is running on port ${Port}`);
// });

sslServer.listen(Port, function () {
    console.log(`SSL Server is running on port ${Port}`);
});

app.get("/", (req, res) => {
    res.send("Server is up and running");
});

app.get("/passwordRequirements", (req, res) => {
    res.send(require('./config')["password requirements"]);
})

app.get("/authentication_status", verifyToken, (req, res) => {
    res.status(200).send();
})

// app.get("/re", (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*")
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Max-Age", "1800");
//     res.setHeader("Access-Control-Allow-Headers", "content-type");
//     res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
//     res.redirect('http://localhost:3000/Login');
// })

app.post("/test", (req,res) => {
    console.log(req.body);
    res.status(200).send("test");
});

app.post("/login", Login);
app.post("/register", Register);
app.post("/addNote", AddNote);
app.post("/search", Search);
app.post("/removeNote", RemoveNote)
app.post("/changePassword", Changepass)
app.post("/forgotpass", Forgotpass)
app.post("/resetpass", Resetpass)
