const  User = require("../module/user");

exports.AllUserWork = async(req,res)=>{
  const userInfo = await User.find() ;
  const allWork  = [];
  await userInfo.forEach(user =>{
    if(user.yourWork.length > 0){
       user.yourWork.forEach(elem =>{

        allWork.push({...elem ,username: user.username , email : user.email, isApprove : user.approved}) ;
      })
    }
  })
    
  
   
  return res.render("SubmittedProjects" , {
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user, 
    pageTitle : "User Submitted Work",
    currentPage : "UserWork",
    sub : allWork , 
  })
}

exports.ApproveUser = async(req,res)=>{

  const UpdateUser = await User.findById(req.params.userId);
  // console.log(UpdateUser);
  UpdateUser.approved = true;
  // console.log(UpdateUser);
  await UpdateUser.save();

  const UpdateHost = await User.findById(req.params.hostId);
  
  UpdateHost.hostWorkDone.push(UpdateUser.yourWork);
  await UpdateHost.save();
  
  return res.redirect ("/supervisor/userWork");
}