const User = require("../module/user");
const bcrypt = require("bcryptjs");
exports.getLoginPage = (req,res)=>{

  res.render("login",{
    isLoggedIn : req.session.isLoggedIn , 
    pageTitle : "Login Page",
    currentPage:"Login",
    
    oldInput  : {},
    errorMsg : "",
    
    user : {} ,
    
  })
}
exports.postLoginPage = (req,res)=>{
  const {email,password}= req.body ; 
  User.findOne({email}).then((user) =>{

      if(!user ){
        return res.render("login",{
          isLoggedIn :false , 
          pageTitle : "Login Page",
          currentPage:"Login",
          oldInput  : {email : ''},
          errorMsg : "User does not found",
          user :  {}
 
          
        })
      }
      
      return bcrypt.compare(password, user.password).then(isMatch =>{
      if(!isMatch){
        return res.render("login",{
          isLoggedIn :false , 
          pageTitle : "Login Page",
          currentPage:"Login",
          oldInput  : {email},
          errorMsg : "Password does not match",
          user : {},
          

          
        })
      }
      req.session.isLoggedIn =  true;
      req.session.user = user ;
      return req.session.save(err=>{
        if(err) console.log(err);
        return res.redirect("/reels");
      }
    )
      
   
    })
      
  
    
  }).catch(err=>{
    return res.render("login",{
    isLoggedIn :false , 
    pageTitle : "Login Page",
    currentPage:"Login",
    oldInput  : {username},
    errorMsg : "Either username or password is wrong",
    user : {}
    
  })
  })
  
  
}

exports.postLogout = (req,res)=>{
  // res.cookie('isLoggedIn' , false);
  req.session.isLoggedIn = false;
  res.redirect("/login");
}