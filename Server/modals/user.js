const mongoose = require('mongoose');
const userSchema =new mongoose.Schema({
name:{type:String  ,required :true},
email:{type:String ,required:true , unique:true},
apikey:{type:String,   unique:true},
loginId:{type:String ,required:true,unique:true},
password:{type:String ,required:true},
securityQuestion:{type:String,required:true},
securityAnswer:{type:String ,required:true},
birthDate:{type:Date,required:true},
contactNumber:{type:String,required:true},
image:{type:String},
otp:{type:String},
otpExpires:{type:Date},
isVerified:{type:Boolean, default: false},
createdAt:{type:Date,default:Date.now}


})
module.exports=mongoose.model('user',userSchema);