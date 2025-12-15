const express = require("express");
const Approuter = express.Router() ;
const {WatchReels} = require("../controllers/app");

Approuter.get("/" , WatchReels);

module.exports = Approuter;