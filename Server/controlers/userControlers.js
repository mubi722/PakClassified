const user=require('../modals/user');
const { sendOTP } = require('../tools/emailService');
const signupUser=async(req,res)=>{
try{
const{name,email,apikey,loginId,password,securityQuestion,securityAnswer,birthDate,contactNumber }=req.body;
let image="";
if(req.file){
    image=`http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`;
}
/************************************ helper Required field check***************************************/ 
// require only the main fields from the client; make other fields optional
if(!name||!email||!loginId||!password||!contactNumber)
    {
        return res.status(400).json({message:"Required fields: name, email, loginId, password, contactNumber"})
    }
/************************************ helper  password length check  ************************************/  
if (password.length<6){
 return res.status(400).json({message:"password must be at least 6 characters long"})
}
/*************************************helper email  check *********************************************************/
const exsistemail= await user.findOne({email});
if (exsistemail){
    return res.status(400).json({message:"Emailalready exsist "})
}
/*************************************helper loginId check*********************************************************/
const exsistloginId= await user.findOne({loginId});
if (exsistloginId){
    return res.status(400).json({message:"loginId has been taken"})
}
/*************************************helper  create new user*****************************************************/
const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

const  newuser= await user.create ({
    name,email,apikey,loginId,password,securityQuestion,securityAnswer,birthDate,contactNumber,image,otp,otpExpires,isVerified: false
})

// Generate and send OTP

// Send OTP via email
try {
    await sendOTP(email, otp);
    console.log(`OTP email sent to ${email}`);
} catch (emailError) {
    console.error('Failed to send OTP email:', emailError);
    // Remove incomplete user if email delivery fails
    await user.findByIdAndDelete(newuser._id);
    return res.status(500).json({ message: 'Failed to send OTP email. Please try again later.' });
}

let userData = newuser.toObject ? newuser.toObject() : newuser;
// Format image URL if it exists
if (userData.image && !userData.image.startsWith('http')) {
    userData.image = `http://localhost:5000/${userData.image.replace(/\\/g, '/')}`;
}
// Don't return password to frontend
delete userData.password;
res.status(201).json({
    message:"user registered successfully. Check your email for OTP.",
    user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        image: userData.image,
        contactNumber: userData.contactNumber
    }
})
}
catch(error){
    console.error('error in signup',error)
    return res.status(500).json({ message: 'Internal server error' });
}
}
/**********************************disply all users**************************************************/
 const getallusers= async (req,res)=>{
    try{
    const users=await user.find();
    res.status(200).json({users})
    }
    catch(error){
        console.error('error in fetching users',error)
        return res.status(500).json({ message: 'Internal server error' });
    }
 }
/**********************************display single user*****************************************************/
const getoneuser=async(req,res)=>{
    const id=req.params.id;
    try{
  const singleuser= await user.findById(id);
  if (!singleuser){
     return res.status(404).json({message:"user not found"})
    }
  let userData = singleuser.toObject ? singleuser.toObject() : singleuser;
  if (userData.image && !userData.image.startsWith('http')) {
      userData.image = `http://localhost:5000/${userData.image.replace(/\\/g, '/')}`;
  }
res.status(200).json({singleuser: userData}) 
}
catch(error){
    console.error('error in fetching single user',error)
    return res.status(500).json({ message: 'Internal server error' });
}
}

/*************************************update user ***************************/
const updateuser= async(req,res)=>{
    const id=req.params.id;
    try{
        const updateduser=await user.findByIdAndUpdate(id,req.body,{new:true});
        if(!updateduser){
           return res.status(404).json({message:"user not found "})
        }
         res.status(200).json({updateduser});
    }
    catch(error){
        console.log ("error in updating user ",error)
        return res.status(500).json({ message: 'Internal server error' });
    }
}
/*************************************delete user ***************************/
const deleteuser=async(req,res)=>{
    const  id =req.params.id;
    try{
        const deleteuser= await user.findByIdAndDelete(id)
        if (!deleteuser){
         return res.status(404).json({message:"user not found"})
    }

    res.status(200).json({message:"user deleted successfully"})
}
    catch(error){
    console.log("error in deleting user",error) 
    return res.status(500).json({ message: 'Internal server error' });
    }
}
/*************************************verify OTP***************************/
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (existingUser.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > existingUser.otpExpires) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Clear OTP after successful verification and mark as verified
        existingUser.otp = undefined;
        existingUser.otpExpires = undefined;
        existingUser.isVerified = true;
        await existingUser.save();

        res.status(200).json({
            message: 'OTP verified successfully',
            success: true,
            userId: existingUser._id
        });
    } catch (error) {
        console.log('error in OTP verification', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*************************************login user***************************/
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // For now, simple password check (in production, use bcrypt)
        if (existingUser.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Check if user is verified (allow existing users to login and mark them as verified)
        if (existingUser.isVerified === false) {
            // For backward compatibility, mark existing users as verified on first login
            existingUser.isVerified = true;
            await existingUser.save();
        }

        let userData = existingUser.toObject ? existingUser.toObject() : existingUser;
        // Format image URL if it exists
        if (userData.image && !userData.image.startsWith('http')) {
            userData.image = `http://localhost:5000/${userData.image.replace(/\\/g, '/')}`;
        }
        // Remove sensitive data
        delete userData.password;
        delete userData.otp;
        delete userData.otpExpires;

        res.status(200).json({ message: 'Login successful', user: userData });
    } catch (error) {
        console.log('error in login', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/*************************************resend OTP***************************/
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`Resend OTP requested for ${email}`);
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user with new OTP
        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        await existingUser.save();

        // Send OTP via email
        try {
            await sendOTP(email, otp);
            console.log(`OTP resent to ${email}`);
        } catch (emailError) {
            console.error('Failed to resend OTP email:', emailError);
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.log('error in resending OTP', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports={signupUser,getallusers,getoneuser,updateuser,deleteuser,loginUser,verifyOtp,resendOtp}