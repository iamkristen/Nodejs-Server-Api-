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
        await User.findById(req.params.id).then(async (yeah)=>{
            if(yeah){
                await User.findByIdAndUpdate( req.params.id,{
                    $set : req.body,
                  },{new:true}).then((updatedUser)=>{
                    res.status(200).json(updatedUser)})
            }else{
                res.status(404).send("User not found");
            }
         });
        //  await User.findById(req.params.id).then(async (user)=>{
        //     console.log(user);
        //     if(user){
        //     const updatedUser = await User.findByIdAndUpdate(
                // req.params.id,{
                //   $set : req.body,
                // },{new:true}
        //     )
        //     res.status(200).json(updatedUser);
        //     }else{
        //         res.status(404).send("User not found.");
        //     }
        //  });
        
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
        res.status(500).send(error);
    }
})

router.get('/users/:id',verifyToken,async (req,res)=>{
    
try {
    await User.findById(req.params.id).then(async (user)=>{
        if(user){
            await User.findById(req.params.id).then((userData)=>{
                const {password,__v, ...others} = userData._doc;
                res.status(200).json(others)})
        }else{
            res.status(404).send("User not found");
        }
     });
    
//     await User.findById(req.params.id).then(async (user)=>{ 
//     if(user){
//     const user = await User.findById(req.params.id);
//     const {password,__v, ...others} = user._doc;
//     res.status(200).json(others);
// }})
} catch (error) {
    res.status(500).json(error);
}
})

router.get('/users/',verifyToken,async (req,res)=>{
    const query = req.query.new;
    const user = query ? await User.find().sort({_id:-1}).limit(1) : await User.find();
    res.status(200).json(user);
})

router.get('/stats/users/',verifyToken,async (req,res)=>{
    const date = new Date();
    const lastYear = new Date (date.setFullYear(date.getFullYear()-1));
    try {
        const data = await User.aggregate([
            {$match: {createdAt : {$gte : lastYear}}},
        {
            $project : {
                month : { $month : "$createdAt"}
            }
        },
        {
            $group : {
                _id : "$month",
                total : {$sum: 1}
            }
        }
        ]);
        res.status(200).json(data);

    } catch (error) {
        res.status(500).send(error);
    }
})


module.exports = router;