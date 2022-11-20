const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const authHeaders = req.headers.token;

if(authHeaders){
    var token = authHeaders.split(" ")[1];
    // console.log(token)

    jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
    if(err) res.status(403).json("Token is not valid!");
    req.user = user;
    next();
})
}else{
    return res.status(401).json('You are not authenticated');
}
};

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken((req,res,()=>{
        // console.log(req.user.id);
        // if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        // }else{
        //     res.status(403).json("you are not allowed in this area.")
        // }
    }),)
}

module.exports = {verifyToken,verifyTokenAndAuthorization}