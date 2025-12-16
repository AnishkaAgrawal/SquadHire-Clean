const express = require("express") ; 
const SupRouter = express();

const {AllUserWork,ApproveUser} = require("../controllers/super.js");

SupRouter.get("/userWork" , AllUserWork);
SupRouter.post("/approve-user/:hostId/:userId" , ApproveUser);

module.exports = SupRouter ; 