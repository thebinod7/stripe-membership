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
const PricingController = require("./controllers/pricing");
const ProductController = require("./controllers/product");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

// 1. Add tenant to stripe customer list
app.post("/add-customer", async (req, res) => {
  try {
    const { body } = req;
    const cus = await stripe.customers.create({
      name: body.name,
      email: body.email,
      description: body.description || "",
    });
    body.stripe_cus_id = cus.id;
    const customer = await CustomerController.saveCustomer(body);
    res.json({ success: true, customer });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// 2. Add product and create pricing
app.post("/add-product", async (req, res) => {
  try {
    const { body } = req;
    const exist = await ProductController.getProductByName(body.name);
    if (exist) throw Error("Product already exist!");
    const stripe_product = await stripe.products.create({ name: body.name });
    body.stripe_product_id = stripe_product.id;
    const product = await ProductController.saveProduct(body);
    await createProductPrice({
      ...body,
      stripe_product_id: stripe_product.id,
    });
    res.json({ success: true, product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

const createProductPrice = async (payload) => {
  const stripe_price_payload = {
    product: payload.stripe_product_id,
    unit_amount: payload.unit_amount,
    currency: "eur",
  };
  if (payload.recurring) stripe_price_payload.recurring = payload.recurring;
  const price = await stripe.prices.create(stripe_price_payload);
  payload.stripe_price_id = price.id;
  return PricingController.createPricing(payload);
};

// 3. Subscribe to membership
app.post("/subscribe", async (req, res) => {
  try {
    const { stripe_cus_id, price_id } = req.body;
    // Create an invoiceItem (Adds pending invoices)
    await stripe.invoiceItems.create({
      customer: stripe_cus_id,
      price: price_id,
    });
    // Create an invoice
    const invoice = await stripe.invoices.create({
      customer: stripe_cus_id,
      collection_method: "send_invoice",
      days_until_due: 30,
    });
    // Finalize invoice
    const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
    // Send invoice
    const sent_invoice = await stripe.invoices.sendInvoice(finalized.id);
    await MembershipController.saveMembership({ stripe_cus_id, price_id });
    res.json({ success: true, data: sent_invoice });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// 4. Match the raw body to content type application/json
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
