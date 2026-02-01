"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Freebie = React.forwardRef((props, ref) => {
  const { show, setShow } = props;
  if (!show) return null;
  const freebieRef = useRef(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);  

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !submitted) {
          setTimeout(() => setShowPrompt(true), 200); // delay before showing
        }
      },
      { threshold: 0.2 }
    );
    if (freebieRef.current) observer.observe(freebieRef.current);
    return () => {
      if (freebieRef.current) observer.unobserve(freebieRef.current);
    };
  }, [submitted]);

const saveEmail = async () => {
  if (!email) return;

  try {
    toast.loading("Getting your gift babe...");
    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
    setShowPrompt(false);
  } catch (error) {
    toast.error("Oops! Something wrong saving your email, kindly retry.");
  }finally{
    toast.dismiss();
    setLoading(false);
  }
};


  const handleDownload = async ()  => {
    await saveEmail();
    const link = document.createElement("a");
    link.href = "/Debs-Crypto-Investing-Starter-Pack.pdf";
    link.download = "Debs-Crypto-Investing-Starter-Pack.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Yaaay! Check your downloads for the guide baby!");
    setShowPrompt(false);
  }

  const handleNavigate = async () => {
    await saveEmail();
    window.location.href = "/freeclass";
    setShowPrompt(false);
  };

  return (
    <>
      {/* Attach to your Freebie section */}
      <div ref={freebieRef} id="freebie-observer" />

      {showPrompt && !submitted && (
        <div className="fixed bottom-5 right-4 bg-white p-4 shadow-lg rounded-xl border border-pink-200 z-[9999] max-w-[90vw] md:max-w-sm w-full animate-fade-in font-space py-10">
          <button className="color-pink-500 absolute top-2 text-xl text-pink-500 right-5" onClick={()=>{setShowPrompt(false)}}>X</button>
          <h2 className="text-base font-medium mb-2 text-gray-700 pb-8">
           Hey girlie💕, I noticed you skipped the freebie... but I got you.
          </h2>
          <p className="text-sm mb-2 text-gray-700">
            I have a starter pack that can help you start earning fast and easy.<br/> Enter your email and i will send to you 
          </p>
          <form onSubmit={ (e) => e.preventDefault()} className="flex flex-col gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleDownload}
              type="button"
              className="bg-[#f2419c00] text-gray-800 border-[1px] border-[#F2419C] py-2 rounded-md hover:bg-pink-600 transition"
            >
              Get Me The Guide 📩
            </button>
            {/* <button
              onClick={handleNavigate}
              type="button"
              className="bg-[#F2419C] text-white py-2 rounded-md hover:bg-pink-600 transition"
            >
              Check out free workshop
            </button> */}
          </form>
        </div>
      )}
    </>
  );
});


export default Freebie;