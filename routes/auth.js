const router = require('express').Router();
const User = require('../models/User');
const cryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
 
// Register

router.post('/register' , async (req,res)=>{
const newUser = new User({
    username : req.body.username,
    email : req.body.email,
    password : cryptoJs.AES.encrypt(req.body.password,process.env.PASS_SEC).toString(),
    
});
try{
    User.findOne({
        username: req.body.username,
    }).
    then((user)=>{
        if(user){
            res.json("Username already exist.");
        }else{
            User.findOne({
                email: req.body.email,
            }).
            then((user)=>{
                if(user){
                    res.json("Email already exist.");
                }else{
                    newUser.save().then((savedUser)=>{
                        res.status(201).json(savedUser);
                    }).catch(err=> {
                        res.status(500).json(err);
                    })
                }
            });
        }
    });

}catch(err){
    res.status(500).json(err);
}
});

//Login 
router.post('/login',(req,res)=>{
    try{ 
        const login = User.findOne({
            username: req.body.username,
        }).then((user)=>{
            console.warn(user);
            if(!user){
                res.status(404).json("user not found");
            }else{
                const hashedPassword = cryptoJs.AES.decrypt(user.password,process.env.PASS_SEC).toString(cryptoJs.enc.Utf8);
                if(req.body.password == hashedPassword){
                    const accessToken = jwt.sign({
                        id: user.id,
                        isAdmin: user.isAdmin
                    },
                    process.env.JWT_SEC,
                    {
                        expiresIn: '3d'
                    }
                    );
                    const {password,...detail} = user._doc; 
                    res.status(200).json({...detail,accessToken});
                } else{
                    res.status(401).json("Wrong Credential");
                }
            }
        
        })
    }catch(err){
        res.status(500).json(err)
    }
    
})


module.exports = router;