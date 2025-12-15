const express = require("express");
const LoginRouter = express.Router();
const {getLoginPage,postLoginPage,postLogout} = require("../controllers/login.js") ;
LoginRouter.get("/login" ,getLoginPage );
LoginRouter.post("/login", postLoginPage);
// LoginRouter.get("/logout" , postLogout);
LoginRouter.post("/logout" , postLogout);
exports.LoginRouter = LoginRouter;