const express = require("express");
const router = express.Router();
const Order = require("../models/objectSchema");
const Product = require("../models/productsSchema") ;
const { default: mongoose } = require("mongoose");
router.get('/',(req,res)=>{
    Order.find().exec()
    .then((docs)=>{
        const response = {
            count: docs.length,
            Orders: docs.map(doc=>{
                return {
                    product: doc.productId,
                    quantity: doc.quantity,
                    id: doc._id
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        console.error(err);
        res.status(500).json({
            error: err
        })
    })
})

router.post('/',(req,res)=>{
    let pId = req.body.productId 
    Product.findById(pId)
    .exec()
    .then((doc)=>{
        if(doc){
            const order = new Order({
                _id : new mongoose.Types.ObjectId() ,
                productId: pId,
                quantity: req.body.quantity
            })
        
            order.save()
            .then((result)=>{
                res.status(200).json({
                    message: "Order Added Successfully",
                    OrderDetail: result,
                    request:{
                        type: 'GET',
                        url:`http://localhost:3000/orders/${result._id}`
                    }
                })
            })
            .catch((err)=>{
                console.error(err);
                res.status(500).json({
                    error: err 
                })
            })
        }
        else{
            res.status(404).json({
                error: "Please Enter Valid Product Id"
            })
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.get('/:orderID' , (req,res,next)=>{
    const id = req.params.orderID;
    Order.findById(id)
    .exec()
    .then((result)=>{
        if(result){
            res.status(200).json({
                "message": "Found the Order",
                OrderDetail : result
            })
        }
        else{
            res.status(404).json({
                error: "Enter Valid ID"
            })
        }
    })
    .catch((err)=>{
        console.error(err);
    })
})

router.patch('/:orderID' , (req,res)=>{
    res.send("Welcome to patch Route of orderID");
})

router.delete('/:orderID' , (req,res)=>{
    const id = req.params.orderID ;
    Order.deleteOne({_id: id})
    .exec()
    .then(result=>{
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err 
        })
    })
})
module.exports = router;