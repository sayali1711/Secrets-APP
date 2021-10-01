//jshint esversion:6
require('dotenv').config(); //for env variables
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/UserDB", { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = mongoose.model('User', userSchema);


app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");

});
//level1
app.post("/register", function(req, res) {
    const userName = req.body.username;
    const Password = req.body.password;
    const newUser = User({
        email: userName,
        password: Password
    });
    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

});

//level1
app.post("/login", function(req, res) {
    const userName = req.body.username;
    const Password = req.body.password;
    User.findOne({ email: userName }, function(err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            if (foundUser) {
                if (foundUser.password === Password) {
                    res.render("secrets");
                }
            }
        }
    });
});










app.listen(3000, function() {
    console.log("Server Started Successfully on Port 3000");
})