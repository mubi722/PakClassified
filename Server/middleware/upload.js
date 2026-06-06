const multer=require('multer');
const path=require('path');

// Storage for user images
const userStorage=multer.diskStorage({
    destination:function(req,file, cb){
        cb(null,"uploads/userimages")
    },
    filename:function(req,file, cb){
        cb(null , file.originalname)
    }
})

// Storage for ad images
const adStorage=multer.diskStorage({
    destination:function(req,file, cb){
        cb(null,"uploads/adimages")
    },
    filename:function(req,file, cb){
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const safeName = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-.]/g, "");
        cb(null, `${uniqueSuffix}-${safeName}`);
    }
})

const uploadUser=multer({ storage: userStorage})
const uploadAds=multer({ storage: adStorage})

module.exports={ uploadUser, uploadAds };