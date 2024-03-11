const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser') ;
const mongoose = require('mongoose') ;

const ProductsRoute = require('./api/routes/products')
const OrdersRoute = require('./api/routes/orders')
const UserRoute = require('./api/routes/users')
mongoose.connect('mongodb+srv://sushant:Atlas2024@cluster0.ls148ff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

// app.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Origin","*") ;
//     res.header("Access-Control-Allow-Headers",
//     "Origin, X-Requested-With,Content-Type,Accept,Authorization");

//     if(req.method === 'OPTIONS'){
//         res.header("Access-Control-Allow-Methods" , 
//         "PUT,POST,PATCH,DELETE,GET")

//         res.status(200).json({});
//     }
// })
app.use('/products' , ProductsRoute);
app.use('/orders' , OrdersRoute)
app.use('/users' , UserRoute)


app.get('/',(req,res)=>{
    res.send("Welcome to Page!");
})
app.use((req,res,next)=>{
    const error = new Error("Route Not FOund");
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500) ;
    res.json({
        message: error.message,
        status: error.status
    })
})

module.exports = app ;
