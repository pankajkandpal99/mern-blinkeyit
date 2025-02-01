import stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable missing!");
}

const Stripe = new stripe(STRIPE_SECRET_KEY);

export default Stripe;
