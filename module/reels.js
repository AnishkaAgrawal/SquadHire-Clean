
const mongoose = require("mongoose");
const  reelSchema = mongoose.Schema({
  videoUrl : {type:String , required:true},
  caption : {type:String},
  like: {type : Number , default : 0 },
  dislikes :{type:Number, default : 0},
  comments : [String],
  description : {type : String} , 

})

module.exports = mongoose.model("Reel" , reelSchema);