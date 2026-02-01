// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)


// const MY_DOMAIN = NEXT_PUBLIC_SITE_URL!;

export async function POST(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 19900, // $199 in cents
            product_data: {
              name: "GirlsinCryptoHub 8 Weeks Bootcamp",
              description: "Was on a discount for $99 for a limited time. Now at original price $199",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/bootcamp?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
