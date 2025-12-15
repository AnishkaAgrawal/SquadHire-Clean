const Reel = require("../module/reels")

exports.WatchReels = async(req,res)=>{
  
    const reels = await Reel.find();
    return res.render("Reel" , {
      reels : reels,
      user : req.session.user,
      isLoggedIn : req.session.isLoggedIn , 
      pageTitle : "SquadHire|HomePage",
      currentPage : "all"
    })
}