const express = require('express');
const cors = require('cors');
const connectdb = require ('./config/db.js');
const signupRoute=require('./routes/userroutes.js');
const adsRoute=require('./routes/adsroutes.js');
const categoryRoute=require('./routes/categoryroutes.js');
require ('dotenv').config();
const app=express();

const PORT=process.env.PORT||5000; 

connectdb();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth',signupRoute);
app.use('/api/ads',adsRoute);
app.use('/api/categories',categoryRoute);

app.get('/', (req, res) => 
    res.json({ 
        message: "Welcome to PakClassified API",
        version: '1.0.0'
        
        }));

app.listen(PORT,()=>{
    console.log (`Server is listing at  ${PORT}`)
   });
