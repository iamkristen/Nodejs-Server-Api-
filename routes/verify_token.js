const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const authHeaders = req.headers;
if(authHeaders.authorization){
    var token = authHeaders.authorization.split(" ")[1];
    jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
    if(err) res.status(403).send("Token is not valid!");
    req.user = user;
    if((req.user.id === req.params.id )|| req.user.isAdmin){
        next();
    }else{
        res.status(403).send("You are not allowed.")
    }
})
}else{
    return res.status(401).send('You are not authenticated');
}
};

// const verifyTokenAndAuthorization = (req,res,next)=>{
//     req.headers.
//     verifyToken((req,res, ()=>{
//         console.log(req.user.id);
//         if(req.user.id === req.params.id || req.user.isAdmin){
//             next();
//         }else{
//             res?.status(403).json("You are not allowed in this area.")
//         }
//     }
//     ),
//     )
// }

module.exports = { verifyToken}