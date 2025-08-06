import { PDFDocument } from 'pdf-lib';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function handler(req, res) {
  if (req.method === 'POST' && req.body.action === 'checkout') {
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[{price:'price_xxx',quantity:1}],
      mode:'payment',
      success_url:req.headers.origin,
      cancel_url:req.headers.origin,
    });
    return res.json({id:session.id});
  }
  return res.sendStatus(405);
}
