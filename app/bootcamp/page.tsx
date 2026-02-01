// app/masterclass/page.tsx

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useState } from "react";

const MasterclassPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); 

  const handleCheckout = async () => {
    try{
    setIsLoading(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    router.push(data.url);
    }catch (error) {
      console.error("Checkout error:", error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div>
    <main className="bg-[#fffdfd] min-h-screen py-16 px-6 font-space text-[#333]">

      <div className=" rounded-lg">  
      <section className="max-w-5xl mx-auto text-center">
        <p className="uppercase text-pink-600 font-semibold tracking-wider text-sm mb-2">🔥 Limited Time</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          GirlsinCryptoHub 8 Weeks Bootcamp
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Master crypto. Learn how to earn. No tech background needed.
        </p>

        <div className="mt-6 flex items-center justify-center gap-4 text-3xl font-bold">
          <span className="line-through text-gray-400 text-xl">$500</span>
          <span className="text-[#F2419C]">$199</span>
        </div>

        <div className="flex flex-col items-center">
        <button
          onClick={handleCheckout}
          className="mt-8 bg-[#F2419C] hover:bg-pink-500 text-white px-8 py-3 rounded-lg transition font-semibold"
        >
          {isLoading? "Loading..." : "💳 Pay with Card (Stripe)"}
        </button>

        <Link href={"https://flutterwave.com/pay/a6jbefq6smgr"}>
        <button
          className="mt-8 bg-[#222122] hover:bg-pink-500 text-white px-8 py-3 rounded-lg transition font-semibold"
        >
          {isLoading? "Loading..." :"🏦 Pay with Transfer (Africa)"}
        </button>
        </Link>
        </div>
      </section>

      {/* Hero Image */}
      <section className="my-16 flex justify-center">
        <Image
          src="/suite-deb.svg"
          alt="Deb Masterclass"
          width={400}
          height={300}
          className="rounded-xl shadow-md"
        />
      </section>

      {/* What's Included */}
      <section className="max-w-4xl mx-auto my-20 rounded-lg bg-pink-300 p-6">
        <h2 className="text-3xl font-bold text-center mb-8">What You&apos;ll Get</h2>
        <ul className="space-y-4">
            {[
              "Clear understanding of crypto, Web3, and blockchain.",
              "Digital income skills that actually pay.",
              "A graceful exit from the 9–5 because soft life > survival mode.",
              "Lessons designed to turn you from “curious” to cashed up",
              "A private network of high achieving women building wealth through crypto",
              "Exposure to tools, platforms & crypto opportunities that move the needle",
              "Confidence to talk crypto and pitch opportunities.",
            ].map((text, i) => (
              <li key={i} className="flex items-center border-b border-dashed border-[#9b4dff]/50 pb-3">
                <div className="w-5 h-5 rounded-full bg-[#9b4dff] border-2 border-white mr-4 relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1 shadow"></div>
                </div>
                <p className="text-base text-[#333333]">{text}</p>
              </li>
            ))}
          </ul>
      </section>

      {/* Testimonial */}
      <section className="bg-[#FEE9F3] py-16 text-center px-6 rounded-xl max-w-4xl mx-auto">
        <p className="italic text-sm text-pink-700">“I took the class and landed my first $500 within 2 weeks…”</p>
        <h3 className="text-2xl font-bold mt-4 text-pink-800">You don’t need to know charts. You just need the right system.</h3>
        <p className="text-gray-600 mt-2 text-sm">– Alice, Private Class</p>
      </section>

      {/* CTA */}
      <section className="mt-20 text-center">
        <h2 className="text-3xl font-bold">It’s your time to glow up.</h2>
        <p className="text-gray-700 mt-2">Invest in yourself $199 now, priceless later.</p>
        <div className="flex flex-col items-center">
        <button
          onClick={handleCheckout}
          className="mt-8 bg-[#F2419C] hover:bg-pink-500 text-white px-8 py-3 rounded-lg transition font-semibold"
        >
          {}💳 Pay with Card (Stripe)
        </button>

        <Link href={"https://flutterwave.com/pay/a6jbefq6smgr"}>
        <button
          className="mt-8 bg-[#222122] hover:bg-[#22212200] hover:text-black/40 text-white px-8 py-3 rounded-lg transition font-semibold"
        >
          🏦 Pay with Transfer (Africa)
        </button>
        </Link>
        </div>
      </section>
      </div>
    </main>
    <Footer/>
    </div>
  );
};

export default MasterclassPage;
