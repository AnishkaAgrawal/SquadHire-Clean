const express = require("express");
const SignUpRouter = express.Router();
const {signup,signupPost} = require("../controllers/signup.js");
SignUpRouter.get("/",signup);
SignUpRouter.post("/" , signupPost);

exports.SignUpRouter = SignUpRouter ;