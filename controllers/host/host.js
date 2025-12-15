const User   = require("../../module/user")
const { check, validationResult } = require("express-validator");
exports.hostProject = async(req,res,next) =>{
  const userDetails = await User.findById(req.session.user._id);
  const info = userDetails.workAssigned ; 
  return res.render("HostHome", {
    pageTitle: "Your All Projects",
    currentPage: "HostHome",
    isLoggedIn: req.session.isLoggedIn,
    
  projects: info,
    

    user : req.session.user,
  });

}
exports.handlegetRequest = (req, res, next) => {
  res.render("ClientAddWork", {
    pageTitle: "House Rent Details",
    currentPage: "addHome",
    isLoggedIn: req.session.isLoggedIn,
    
    house: undefined,
    errorMsg: '',
    oldOutput:[],
    user : req.session.user,
  });
};
exports.postWork =  [
  check("title")
  .notEmpty()
  .withMessage("Project title is required")
  .trim()
  .isLength({ min: 5 })
  .withMessage("Project title should be at least 5 characters long"),

// ✅ DESCRIPTION
check("description")
  .notEmpty()
  .withMessage("Project description is required")
  .trim()
  .isLength({ min: 20 })
  .withMessage("Description should be at least 20 characters"),





  async (req,res,next) =>{
    const {
      title,
      description,
      domain,
      skills,
      duration,
      budget,
      deliverables,
      level
    } = req.body;
    const hostId = req.session.user._id ;
     



    
    const errors = validationResult(req);
    if(errors.isEmpty() ){
    const host = await User.findById(hostId);
    host.workAssigned.push({title,domain,skills,level,description , deliverables , duration , budget});
    await host.save();
    return res.render("HostHome", {
      pageTitle: "Your All Projects",
      currentPage: "HostHome",
      isLoggedIn: req.session.isLoggedIn,
      
    projects: host.workAssigned,
      

      user : req.session.user,
    });
      
    }else{
      return  res.render("ClientAddWork", {
        pageTitle: "House Rent Details",
        currentPage: "addHome",
        isLoggedIn: req.session.isLoggedIn,
        errorMsg: errors.array().map(err=>err.msg),
        oldOutput:{title,
         description,
         domain,
         skills,
         duration,
         budget,
         deliverables,
         level},
        user : req.session.user,
      });
      
    }
    
  }
];


exports.Submission = async (req,res)=>{
  const hostDet = await User.findById(req.session.user._id);
  const workDone = hostDet.hostWorkDone ; 
console.log(workDone);
  return res.render("SubmittedProjects" , {
    user : req.session.user, 
    pageTitle:"Submissions" , 
    currentPage : "completeProject",
    isLoggedIn : req.session.isLoggedIn , 
    sub : workDone , 
  })
}

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    await User.findByIdAndUpdate(
      req.session.user._id,
      {
        $pull: {
          workAssigned: { _id: projectId }
        }
      }
    );

    return res.redirect("/host/go-home");
  } catch (err) {
    console.error(err);
    return res.redirect("/host/go-home");
  }
};
