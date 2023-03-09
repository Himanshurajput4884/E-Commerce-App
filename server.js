const express = require('express');
const cors = require('cors');   // act like a communication bridge when we have to connect frontend with backend
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const stripe = require('stripe')("sk_test_51MjcIhSAhRG1lvxhJNK2T49UpWbA1SYSiESAFeGMpIKXNRKONLrXzXtImcEOMIOJ2dK9WJP9qgCLoa91NYxI5tZm00N8x1OIpP");

// to call express
const app = express();

// to call cors
app.use(cors());

// to convert express into json format
app.use(express.json());


app.get('/', (req, res)=>{
    res.send("Welcome to our Store.");
})

app.post('/checkout', async(req, res)=>{
    let error;
    let status;
    try{
        const {cart, token} = req.body;
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        })
        const key = uuidv4();
        const charge = await stripe.paymentIntents.create({
            amount: cart.totalPrice*100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: 'products descriptions',
            shipping:{
                name: token.card.name,
                address:{
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip,
                }
            }
        }, {idempotencyKey: key})
        status="success";
    }
    catch(error){
        console.log(error);
        status="error";
    }
    res.json({status});
})

app.listen(8080, ()=>{
    console.log("App is running on Port 8080");
})


