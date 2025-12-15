
// const {bcrypt} =require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User  = require("../module/user");
const bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
  res.render("signup", {
    currentPage: "SignUp",
    pageTitle: "SignUp",
    
    oldOutput:{},
    isLoggedIn: false,
    errorMsg: [],
   
    user : {},
  });
};
exports.signupPost = [
  check("username")
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
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("This field can't be emptied")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password should be 8 character long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one UpperCase")
    .matches(/[a-z]/)
    .withMessage("Password should contain atleast 1 Lowercase")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast 1 number")
    .matches(/[%&*^@#!]/)
    .withMessage("Password should contain atleast 1 special character")
    .trim(),

  check("confirmPassword")
    .notEmpty()
    .withMessage("This field can't be empty")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),
  (req, res) => {
    const {username , password, email,userType} =req.body;
    const errors = validationResult(req);
 
    if(!errors.isEmpty()){
      res.render("signup" ,{
        currentPage:"SignUp" , 
        pageTitle: "Fill the details",
        oldOutput:{username , password, email},
        isLoggedIn: false,
        errorMsg: errors.array().map(err=>err.msg),
        user : {},
      }  )
    }else{
      bcrypt.hash(password , 12) . then(hashedpass =>{

        const user = new User({username , email,password : hashedpass,userType});

        return user.save();
      }).then(()=>{
        return res.redirect("/login");
      }).catch(err =>{
        return res.status(422).render("signup" ,{
          currentPage:"SignUp" , 
          pageTitle: "Fill the details",
          oldOutput:{username , password, email},
          isLoggedIn: false,
          errorMsg: ['Email already exists'] ,
          user: {}
        }  )
      })
     
    }
  
  },
];
