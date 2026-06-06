const mongoose = require ('mongoose');

const connectdb = async()=>  {
  try {
    await mongoose.connect (process.env.MONGO_URI)
    console.log ('Mongodb connected successfully.......')
    
  }
  catch(error){
 console.log ("Mongodb connection failed ",error)
  }

  }



module.exports= connectdb
