import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
// import cors from "cors";

const app = express();
const stripe = new Stripe("sk_test_51OtaX0JA4oGedNG8rAzctAxCGtoZMKsCjmkTTYTZ3QG4nzZEpYL4029oQ4oHxTfQTzeRtZfUVgzGTW5CZv3uWqZh00NfpQg12i");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors());

app.post("/payment", cors(), async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-08-01' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd', // Change currency to 'usd'
      customer: customer.id,
      payment_method_types: ['card'],
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).json({ error: "An error occurred while creating payment" });
  }
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});