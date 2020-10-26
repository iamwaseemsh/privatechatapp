const jwt=require("jsonwebtoken")
if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}

function getToken(user){
    return jwt.sign(
        {   id:user._id,
            username:user.username
        },
         process.env.JWT_SECRET,
         {expiresIn:"24h"}
     )
}
function searchAuth(req,res,next){
    const token=req.cookies.token;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err){
               return res.render("users/signin",{errorMessage:"Token is invalid"})

            }
            req.user=decode;
            next();
        return;
        })
        
    }
    else{
        return res.render("users/signin")
    }
    }
const chatAuth=(req,res,next)=>{
    const token=req.cookies.token;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err){
               return res.render("users/signin")

            }
            req.user=decode;
            next();
        return;
        })
        
    }
    else{
        return res.redirect("/")

    }
}



 module.exports= {getToken,chatAuth,searchAuth}

