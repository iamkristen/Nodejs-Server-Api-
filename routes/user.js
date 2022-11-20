const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorization } = require('./verify_token');
const cryptoJs = require('crypto-js');


const router = require('express').Router();

router.put('/users/:id', verifyTokenAndAuthorization,async (req,res)=>{
    if(req.body.password){
    req.body.password = cryptoJs.AES.encrypt(req.body.password,process.env.PASS_SEC).toString()
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,{
              $set : req.body,

            },{new:true}
        )
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;