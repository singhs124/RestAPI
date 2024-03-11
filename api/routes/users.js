const express = require("express");
const router = express.Router();
const User = require('../models/userSchema');
const { default: mongoose, Mongoose } = require("mongoose");
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken')

router.get("/",(req,res)=>{
    res.send("Users Route saying Hi!");
})

router.post("/signup",(req,res)=>{
    User.find({email: req.body.email})
    .exec()
    .then(doc=>{
        if(doc.length >=1){
            res.status(409).json({
                message:"Mail Exists Already"
            })
        }
        else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err) console.log(err);
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash 
                    })
        
                    user.save()
                    .then((result)=>{
                        console.log(result)
                        res.status(200).json({
                            message:"User Created"
                        })
                    })
                    .catch((err)=>{
                        console.log(err);
                        res.status(500).json({
                            message: err
                        })
                    })
                }
            })
        }
    })       
})

router.post("/login",(req,res)=>{
    User.findOne({email: req.body.email})
    .exec()
    .then((doc)=>{
        if(doc.length < 1){
            res.status(401).json({
                message:"Auth Failed"
            })
        }
        
        bcrypt.compare(req.body.password,doc.password,(err,result)=>{
            if(err){
                res.status(401).json({
                    message:"Auth Failed"
                })
            }
            if(result){
                const token = jwt.sign({
                    email: doc.email,
                    id: doc._id
                },'secret',{
                    expiresIn: "1h"
                })
                res.status(200).json({
                    message:"Successfully Logged In",
                    token: token
                })
            }
            // res.status(401).json({
            //     message:"Auth Failed"
            // })
        })
    })
    .catch()
})

router.delete("/:userId",(req,res)=>{
    const id = req.params.userId ;
    User.deleteOne({_id:id})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:"User Deleted"
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err 
        })
    })
})

module.exports = router;