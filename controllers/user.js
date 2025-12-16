const {check,validationResult} = require("express-validator");
const User = require("../module/user");
const Reel = require("../module/reels");

exports.userInterface =  async (req, res, next) => {
    const Userfav = await User.find();
    const projectsAvailable = [];
    await Userfav.map(items=>{
      if(items.workAssigned.length>0){
        items.workAssigned.forEach(element => {
          // console.log("I am here" , element,items);
          projectsAvailable.push({id : items._id , project : element});
        });

      }
      
    })
    // console.log(project);
    return res.render("UserUI", {
      projects: projectsAvailable,
      pageTitle: "SquadHire",
      currentPage: "home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });


};



exports.ProjectDetails  = async(req,res)=>{
  const hostId = req.params.hostId ; 
  const projectId = req.params.projectId;
  const UserDet = await User.findById(hostId);
  // console.log(UserDet);
  const projectDetails   = UserDet.workAssigned.id(req.params.projectId);
  // console.log("Hello" ,projectDetails);
  return res.render("projectDetails" , {
    pageTitle:"Details",
    currentPage : '',
    hostId : hostId , 
    projectId:projectId , 
    user : req.session.user ,
    isLoggedIn:req.session.isLoggedIn , 
    projectDetails:projectDetails,
  })
}
exports.UserProfile = async (req,res)=>{
  const userDetails = await User.findById(req.session.user._id);
  
  return res.render("Profile" , {
    user : req.session.user  ,
    isLoggedIn :req.session.isLoggedIn , 
    info  : userDetails , 
    pageTitle : "Your Profile",
    currentPage : 'profile' , 
  })
}

exports.EditProfile = [   check("username")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("The name should be atleast 2 character long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("The name should contain alphabets only"),

  check("email")
    .notEmpty()
    .withMessage("This field can't be emptied")
    .normalizeEmail()
    
    , async (req,res)=>{
      const errors = validationResult(req);
      if(errors.length > 0){

        return res.render("editProfile" , {
          currentPage:"" , 
                pageTitle: "Fill the details",
                info:{username : info.username ,userType : info.userType , email :  info.email, id: info._id},
                isLoggedIn: false, 
                user: {},
                errorMsg : errors.array().map(err =>err.msg),
        })
      }
  const userId = req.params.userId ;
  const info = await User.findById(userId);
  // console.log(info);
  return res.render("editProfile" , {
    currentPage:"" , 
          pageTitle: "Fill the details",
          info:{username : info.username ,userType : info.userType , email :  info.email, id : info._id.toString()},
          isLoggedIn: false, 
          user: {},
          
          errorMsg : [],
  })
}]

exports.handleEditProfilePost = async(req,res)=>{
  const findUser = await User.findById(req.params.userId);
  const {  username, email, userType } = req.body ; 
  findUser.username = username;
  findUser.email = email;
  findUser.userType = userType ; 

  await findUser.save();
  return res.redirect(`/guest`) ; 
}

exports.handleUploadPhoto = async(req,res)=>{
  // console.log(req.file);
  const info = req.session.user ; 
  
  if(req.file){
    info.photo = "/uploads/" + req.file.filename ; 
   
  }else{
    return res.status(422).send("please upload correct image")
  }
  const userDetails =await  User.findById(info._id);
  userDetails.userProfile = info.photo ; 
  await userDetails.save();
  
  req.session.user.userProfile = info.photo;

  return res.render("Profile" , {
    user : req.session.user  ,
    isLoggedIn :req.session.isLoggedIn , 
    info  : info , 
    pageTitle : "Your Profile",
    currentPage : 'profile' , 
  })
}

exports.Reels = async (req,res)=>{
  const userInfo = await User.findById(req.session.user._id);
  const yourReels = []
  await userInfo.reels.forEach(async(elem) =>{
    const reelDetail = await Reel.findById(elem);
    console.log(reelDetail, "I am here");
    yourReels.push(reelDetail);
  }); 
  await userInfo.save();
  console.log(yourReels);
  
  return res.render("Reel" , {
    reels : yourReels,
    user : req.session.user,
    isLoggedIn : req.session.isLoggedIn , 
    pageTitle : "Your Reels",
    currentPage : "Reel"
  })
}

exports.AddReels =  async (req,res)=>{
  if(!req.file){
    res.status(422).render("please upload video");
  }else{

    const {caption , description } = req.body ;
    const video = "/uploads/reels/" + req.file.filename ; 

    const reel = new Reel({
      videoUrl : video, 
      caption , 
      description,

    })

    await reel.save() ; 
    const userId = req.session.user._id;
    const userInfo = await User.findById(userId);
    userInfo.reels.push(reel._id);
    await userInfo.save();
    return res.redirect("/guest/reel");

  }

} 

exports.GetAddReels = (req,res)=>{
  
  return res.render("AddReel" , {
    pageTitle : "Add Reel" , 
    currentPage : "" , 
    isLoggedIn : req.session.isLoggedIn  ,
    user : req.session.user ,
  }) ; 
}

exports.UserApplied = (req,res)=>{
  const projectId = req.params.projectId;
  const hostId = req.params.hostId ; 

  return res.render("ApplyForm" , 
    {
      user :req.session.user, 
      isLoggedIn : req.session.isLoggedIn , 
      projectId:req.params.projectId , 
      pageTitle  :"Apply Form",
      currentPage : "",
      projectId,
      hostId
    
    })
}

exports.postWorkForm = async (req,res)=>{
  // console.log("inside work done" , req.body, req.files );
  // const project

  const userInfo = await User.findById(req.session.user._id); 
  userInfo.yourWork = {
    hostId : req.params.hostId,
    userId : userInfo._id ,
     ...req.body , 
    ...req.files,
    
  }

  await userInfo.save() ;

  console.log(req.params.hostId);
  const hostDet = await User.findById(req.params.hostId);
  console.log(hostDet);
  hostDet.hostWorkDone.push({
    ...req.body , 
    ...req.files,
    userId: userInfo._id ,
    username : userInfo.username , 
    email : userInfo.email , 
    userProfile  :userInfo.userProfile , 
  });
  await hostDet.save();
  return res.redirect("/guest");
}

exports.UserWorkDisplay = async (req,res)=>{
  const info = await User.findById(req.session.user._id);
  console.log(info);
  return res.render("YourWork" , {
    user : req.session.user,
    isLoggedIn :req.session.isLoggedIn ,
    pageTitle : "Your All Submissions Together",
    currentPage: "UserWork" , 
    work : info.yourWork , 
  })
}

exports.ViewProjects = async(req,res)=>{
  const info = await User.find();
  const AllProjects = [];
  info.forEach(elem =>{
    if(elem.workAssigned.length >0){
      AllProjects.push(...elem.workAssigned) ; 
    }
  })

  return res.render("")
}