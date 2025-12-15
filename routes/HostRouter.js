const express = require("express");
const HostRouter = express.Router();

const {handlegetRequest,postWork,hostProject,Submission,deleteProject} = require("../controllers/host/host");

HostRouter.use(express.urlencoded())
HostRouter.get("/go-home",hostProject);
HostRouter.get("/add-project",handlegetRequest);
HostRouter.post("/add-project",postWork);
HostRouter.get("/complete",Submission);
HostRouter.post("/delete-project", deleteProject);




module.exports = { HostRouter };