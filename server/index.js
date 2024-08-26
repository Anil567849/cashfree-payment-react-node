import express from 'express';
const app = express();
import axios from 'axios';
import cors from 'cors';

app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(express.json());
import { Cashfree } from "cashfree-pg"; 
Cashfree.XClientId = process.env.ID;
Cashfree.XClientSecret = process.env.SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

app.post('/create-order', async (req, res) => {
    const { price } = req.body;
  
      var request = {
        order_amount: price,
        order_currency: "INR",
        customer_details: {
          customer_id: "node_sdk_test",
          customer_name: "",
          customer_email: "example@gmail.com",
          customer_phone: "9999999999"
        },
      }
    
  
      Cashfree.PGCreateOrder("2023-08-01", request).then((response) => {
        res.status(200).json({"payment_session_id": response.data.payment_session_id})
      })
        .catch((error) => {
          console.error('Error setting up order request:', error.response.data);
          res.status(400).send("sorry");
      });
});


app.post('/create-payment-session', async (req, res) => {
    const { price } = req.body;
  
    const requestBody = {
        customer_details: {
            customer_id: '12',
            customer_phone: '7845784578',
            customer_email: 'anil@gmail.com',
        },
        order_amount: parseInt(price),
        order_currency: 'INR',
    };
  
    try {
      const response = await axios.post('https://sandbox.cashfree.com/pg/orders', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.ID,
          'x-client-secret': process.env.SECRET,
          'x-api-version': '2021-05-21',
        },
      });

      console.log(response.data);
  
      res.json({ payment_link: response.data.payment_link });
    } catch (error) {
      console.error('Error creating payment session:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to create payment session' });
    }
});



app.listen(8000, () => {
    console.log("started");
})