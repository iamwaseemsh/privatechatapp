
const jwt=require("jsonwebtoken");
if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}

const getToken=(user)=>{
   
return jwt.sign(
   user,
    process.env.JWT.SECRET,{expiresIn:"24h"}
)}


exports.getToken= getToken