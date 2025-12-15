
const express = require("express");
const multer = require("multer");
const path = require("path");
const {userInterface,ProjectDetails,AddReels,UserProfile,EditProfile,handleEditProfilePost,handleUploadPhoto,Reels,UserApplied ,UserWorkDisplay,GetAddReels,postWorkForm} = require("../controllers/user")
const UserRouter = express.Router();


const uploadFolder = path.join(__dirname , ".." , "uploads");
const uploadVideo = path.join(__dirname , ".." , "uploads" , "/" , "reels");
const uploadApplyFilter = path.join(__dirname , ".." , "uploads" , "/","work-done");
const randomString = (length=10)=>{
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}                 
const storage = multer.diskStorage({
  destination : (req,file,cb)=>{
    cb(null, uploadFolder);
  },
  filename : (req,file,cb)=>{
    cb(null ,randomString(12) + file.originalname );
  }
})

const fileFilter= (req,file,cb)=>{
  if(["image/png" , "image/jpg" , "image/jpeg"].includes(file.mimetype)){
    cb (null,true);
  }else{
    cb(null, false);
  }
}
const ApplyFormFilter = (req,file,cb)=>{
  const allowedTypes = {
    documentation: ["application/pdf"],
    ppt: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ],
    demoVideo: ["video/mp4", "video/webm"]
  };

  if (
    allowedTypes[file.fieldname] &&
    allowedTypes[file.fieldname].includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}`), false);
  }
};

const videoFileFilter =(req,file,cb)=>{
  if([
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime" // .mov
  ].includes(file.mimetype)){
    cb(null ,true);
  }else{
    cb(null ,false);
  }
}

const multerOptions = {
  storage , fileFilter
}

const videoStorage = multer.diskStorage({
  destination : (req,file,cb)=>{
    cb(null , uploadVideo)
  } ,
  filename  : (req,file,cb)=>{
    cb(null , 
       randomString(12)+ file.originalname )
  }

} )
const ApplyFormStorage = multer.diskStorage({
  destination : (req,file,cb)=>{
    cb(null , uploadApplyFilter)
  },
  filename : (req,file,cb)=>{
    cb(null , file.fieldname +
      "-" + randomString(12)+ path.extname(file.originalname) )
  }
})
const VideoMulter = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
}); 
const ApplyFormMulter= multer({
  storage  : ApplyFormStorage , 
  fileFilter : ApplyFormFilter ,
})


UserRouter.get("/", userInterface);
UserRouter.get("/reels/add", GetAddReels);
UserRouter.post("/reels/add", VideoMulter.single("videoUrl"), AddReels);
UserRouter.get("/reel", Reels);
UserRouter.get("/your-work", UserWorkDisplay);
UserRouter.get("/user-profile", UserProfile);
UserRouter.get("/edit/:userId", EditProfile);
UserRouter.post("/upload-photo", multer(multerOptions).single("userProfile"),handleUploadPhoto);

UserRouter.post("/edit/:userId", handleEditProfilePost);

UserRouter.get("/project/apply/:projectId/:hostId" , UserApplied);
UserRouter.post("/project/apply/:projectId/:hostId",ApplyFormMulter.fields([
  
  { name: "documentation", maxCount: 1 },
  { name: "ppt", maxCount: 1 },
  { name: "demoVideo", maxCount: 1 }
]) , postWorkForm);
UserRouter.get("/project/:projectId/:hostId" , ProjectDetails);




module.exports = UserRouter;
