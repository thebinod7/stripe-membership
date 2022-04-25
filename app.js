// This example uses Express to receive webhooks
const express = require("express");
const app = express();
const config = require("config");
const mongoose = require("mongoose");

const APP_PORT = config.get("app.port");
const STRIPE_SECRET = config.get("app.stripe_secret");
const DB_URL = config.get("app.db_url");

const stripe = require("stripe")(STRIPE_SECRET);

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", function () {
  console.log("Connected to database successfully.");
});
mongoose.connection.on("error", function (err) {
  console.log("Database error:" + " " + err);
});

//===Controllers===
const CustomerController = require("./controllers/customer");
const MembershipController = require("./controllers/membership");
const ProductController = require("./controllers/product");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.post("/add-customer", async (req, res) => {
  try {
    const customer = await CustomerController.saveCustomer(req.body);
    res.json({ success: true, customer });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.post("/add-product", async (req, res) => {
  try {
    const { body } = req;
    const exist = await ProductController.getProductByName(body.name);
    if (exist) throw Error("Product already exist!");
    const stripe_product = await stripe.products.create({ name: body.name });
    body.stripe_product_id = stripe_product.id;
    const product = await ProductController.saveProduct(body);
    res.json({ success: true, product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.post("/subscribe", async (req, res) => {
  try {
    // Create
  } catch (err) {
    throw err;
  }
});

// Create membership plans
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

// Subscribe
app.post("/create-customer", async (req, res) => {
  try {
    const { body } = req;
    const customer = await stripe.customers.create(body);
    res.json({ success: true, customer });
  } catch (err) {
    throw err;
  }
});

//TODO: Subscribe & Payment
app.post("/create-invoice", async (req, res) => {
  try {
    const { body } = req;
    const invoiceItem = await stripe.invoiceItems.create(body); // customer:id, price;
    const invoice = await stripe.invoices.create({
      customer: body.customer,
      collection_method: "send_invoice",
      days_until_due: 30,
    });
    const sent = await stripe.invoices.sendInvoice(invoice.id);
    res.json({ success: true, invoiceItem, invoice, sent });
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
