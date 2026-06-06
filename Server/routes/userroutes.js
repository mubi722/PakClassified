const express= require('express');
const { uploadUser } = require ('../middleware/upload.js');
const router=express.Router();
const { signupUser, getallusers, getoneuser, updateuser, deleteuser, loginUser, verifyOtp, resendOtp } = require('../controlers/userControlers.js');
router.post('/signup', uploadUser.single('image'), signupUser);
router.post('/login', express.json(), loginUser);
router.post('/verify-otp', express.json(), verifyOtp);
router.post('/resend-otp', express.json(), resendOtp);
router.get('/users', getallusers);
router.get('/user/:id', getoneuser);
router.put('/user/:id', updateuser);
router.delete('/user/:id', deleteuser);

module.exports=router;