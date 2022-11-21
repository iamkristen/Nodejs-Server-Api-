const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorization } = require('./verify_token');
const cryptoJs = require('crypto-js');
const { verify } = require('jsonwebtoken');


const router = require('express').Router();

router.put('/users/update/:id', verifyToken,async (req,res)=>{
    
    if(req.body.password){
    req.body.password = cryptoJs.AES.encrypt(req.body.password,process.env.PASS_SEC).toString()
    }
    try{
         await User.findById(req.params.id).then(async (user)=>{
            if(user){
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,{
                  $set : req.body,
                },{new:true}
            )
            res.status(200).json(updatedUser);
            }else{
                res.status(404).send("User not found");
            }
         });
        
    }catch(err){
        res.status(500).json(err)
    }
})

router.delete('/users/delete/:id',verifyToken, async (req,res)=>{
    try {
        await User.findById(req.params.id).then(async (user)=>{
            if(user){
                await User.findByIdAndDelete(req.params.id).then((_)=>res.status(200).send("User has been deleted..."))
            }else{
                res.status(404).send("User not found");
            }
         });
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
})

module.exports = router;