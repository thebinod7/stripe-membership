// This example uses Express to receive webhooks
const express = require("express");
const app = express();
const config = require("config");

const APP_PORT = config.get("app.port");
const STRIPE_SECRET = config.get("app.stripe_secret");

const stripe = require("stripe")(STRIPE_SECRET);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.post("/create-product-price", async (req, res) => {
  try {
    const { body } = req;
    const product = await stripe.products.create(body);
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 100,
      currency: "eur",
    });
    res.json({ success: true, product, price });
  } catch (err) {
    throw err;
  }
});

app.post("/create-customer", async (req, res) => {
  try {
    const { body } = req;
    const customer = await stripe.customers.create(body);
    res.json({ success: true, customer });
  } catch (err) {
    throw err;
  }
});

// Match the raw body to content type application/json
// If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the request body
app.post(
  "/webhook",
  express.json({ type: "application/json" }),
  (request, response) => {
    const event = request.body;

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

app.listen(APP_PORT, () => console.log(`Running on port ${APP_PORT}`));
