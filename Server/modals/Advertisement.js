const mongoose = require ('mongoose')
const advertisementSchema=new mongoose.Schema({
    name:{type : String ,required :true},
    price :{ type:Number , required :true },
    description :{ type:String  , required :true} ,
    features :{type : String },
    startDate :{type:Date , required :true },
    endDate:{type:Date , required:true},
    category:{type:String , required :true},
    city:{type:String , required :true},
    type:{type:String, } ,
    images:[{type:String}],
    postedBy :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true 
    }

}, {timestamps:true});

module.exports=mongoose.model('advertisement',advertisementSchema);