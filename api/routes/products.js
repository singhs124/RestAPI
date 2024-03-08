const express = require("express");
const router = express.Router();
const Product = require("../models/productsSchema");
const { Mongoose, default: mongoose } = require("mongoose");
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'./uploads/')
  },
  filename:(req,file,cb)=>{
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const upload = multer({storage: storage})


router.get("/", (req, res) => {
  Product.find()
  .select('-__v')
  .exec()
  .then((docs)=>{
    const response = {
      count : docs.length ,
      Products : docs.map(doc=>{
        return {
          name: doc.name,
          price: doc.price,
          request: {
            type: 'GET' ,
            url: 'http://localhost:3000/products/'+doc._id 
          }
        }

      })
    }
    res.send(response);
  })
  .catch((err)=>{
    console.log(err) ;
    res.status(500).json({
        error: err 
    })
  })
});

router.post("/", upload.single('productFile') ,(req, res) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.json({
        message: "Product Created Successfully.",
        createProduct: {
          name : result.name ,
          price: result.price ,
          id: result._id 
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productID", (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
  .select('-__v')
  .exec()
  .then((result)=>{
    if(result){
        console.log(result);
        res.status(200).json({
          product: result,
          request:{
            message:"Other Products",
            type: 'GET' ,
            url:"http://localhost:3000/products"
          }
        });
    }
    else{
        res.status(404).json({
            message:"Please Enter Valid ID"
        })
    }
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).json({
        message: err
    })
  });
});

router.patch("/:productID", (req, res) => {
  const id = req.params.productID ;
  const updateOps = {};
  for(const key of Object.keys(req.body)){
    updateOps[key] = req.body[key];
  }
  Product.updateOne({_id: id},{$set :updateOps})
  .exec()
  .then((result)=>{
    console.log(result);
    res.status(200).json({
      message: "Product Updated Successfully",
      request:{
        type: 'GET' ,
        url: `http://localhost:3000/products/${id}`
      }
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
        error: err
    })
  })
});


router.delete("/:productID", (req, res) => {
    const id = req.params.productID ;
    Product.deleteOne({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err 
        })
    })
});

module.exports = router;
