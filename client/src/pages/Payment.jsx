import { load } from "@cashfreepayments/cashfree-js";
import {useState} from 'react';
import axios from 'axios';

function Payment() {
    const [price, setPrice] = useState(0);
    let cashfree;
    var initializeSDK = async function () {          
        cashfree = await load({
            mode: "sandbox"
        });
    }
    initializeSDK();

    const doPayment = async () => {

        try{
            // const {data} = await axios.post('http://localhost:8000/create-payment-session', {price});
            // window.open(data.payment_link);
            const {data} = await axios.post('http://localhost:8000/create-order', {price});
            console.log(data.payment_session_id);
            let op = {
                paymentSessionId: data.payment_session_id,
            }
            const result = await cashfree.checkout(op);
        
            if(result.error){
                // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
                console.log("User has closed the popup or there is some payment error, Check for Payment Status");
                console.log(result.error);
            }
            if(result.redirect){
                // This will be true when the payment redirection page couldnt be opened in the same window
                // This is an exceptional case only when the page is opened inside an inAppBrowser
                // In this case the customer will be redirected to return url once payment is completed
                console.log("Payment will be redirected");
            }
            if(result.paymentDetails){
                // This will be called whenever the payment is completed irrespective of transaction status
                console.log("Payment has been completed, Check for Payment Status");
                console.log(result.paymentDetails.paymentMessage);
            }
        }catch(err){
            alert('error');
        }

    };

    return (
        <div class="row">
            <p>Click below to open the checkout page in current tab</p>
            <input type="number" onChange={(e) => setPrice(e.target.value)} value={price} />
            <button type="submit" class="btn btn-primary" id="renderBtn" onClick={doPayment}>
                Pay Now
            </button>
        </div>
    );
}
export default Payment;