const { verifyToken } = require('./verify_token');
const Product = require('../models/Product');
const router = require('express').Router();



router.get('/products/',async (req,res)=>{
    const queryLimit = req.query.limit;
    const queryCategory = req.query.category;
    var product = await Product.find();
    if(queryLimit && queryCategory){
        product = await Product.find(
            {
                category: {$in: queryCategory}
            }
        ).limit(queryLimit);
    }
    else if(queryLimit){
        product = await Product.find().limit(queryLimit);
    }else if(queryCategory){
       product = await Product.find(
            {
                category: {$in: queryCategory}
            }
        );
    }else{
        product = await Product.find();m
    }
    res.status(200).json(product);
})

router.post("/products/add/",verifyToken,async (req,res)=> {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post("/products/update/:id",verifyToken,async (req,res)=> {
    if(req.params.id){
        await Product.findById(req.params.id).then((yeah)=>{
            if(yeah){
                Product.findOneAndUpdate(req.params.id,{
                    $set : req.body,},{new: true})
                .then((updatedProduct)=> {
                    res.status(201).json(updatedProduct);
                })
            }
        })
    }
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;