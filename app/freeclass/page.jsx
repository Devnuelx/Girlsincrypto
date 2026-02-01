"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import FreeclassModal from "../../components/FreeclassModal";
import "./freeclass.css"
import Script from "next/script";
import Link from "next/link";



const Freeclass = () => {
const [hasMounted, setHasMounted] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);



  // Ensure the component has mounted before rendering
  // This prevents hydration mismatch errors in Next.js
  // by ensuring that the countdown starts only after the component has mounted
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const calculateTimeLeft = () => {
    const targetDate = new Date("2025-08-10T18:00:00Z"); // 6 PM UTC
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  

    return {
      days: `${Math.floor(difference / (1000 * 60 * 60 * 24))}:`,
      hours: `${Math.floor((difference / (1000 * 60 * 60)) % 24)}:`,
      minutes: `${Math.floor((difference / 1000 / 60) % 60)}:`,
      seconds: `${Math.floor((difference / 1000) % 60)}`,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <Script id="ld-event-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "Free Live Masterclass: How To Tap Into Crypto & Web3 as a Woman in 2025",
          "startDate": "2025-07-30T18:00:00Z",
          "endDate": "2025-07-30T20:00:00Z",
          "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": {
            "@type": "VirtualLocation",
            "url": "https://girlsincryptohub.com/freeclass"
          },
          "image": [
            "https://girlsincryptohub.com/coffe-deb.png"
          ],
          "description": "Join our free crypto masterclass and learn how to get started in crypto, web3, and earn as a woman in 2025 no tech background required. Hosted by Deb, founder of GirlsinCryptoHub.",
          "offers": {
            "@type": "Offer",
            "url": "https://girlsincryptohub.com/freeclass",
            "price": "Free",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "validFrom": "2025-07-30T12:00:00Z"
          },
          "organizer": {
            "@type": "Organization",
            "name": "GirlsinCryptoHub",
            "url": "https://girlsincryptohub.com"
          }
        })}
      </Script>

    <div className="min-h-screen bg-[#fcfdf2] text-gray-900 font-space">
      {/* Navbar */}
      <nav className="w-10/12 mx-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-4 shadow-sm bg-[#fcfdf2] sticky top-0 z-50 gap-4 md:gap-0">
        <div className="text-2xl font-bold text-[#F2419C] tracking-tight">
          <Link href={"/"}>
          <span className="italic">Girls</span>inCryptoHub
          </Link>
        </div>
        <div className="flex gap-4 sm:gap-6 text-center text-sm sm:text-base justify-center items-center font-semibold text-[#F2419C]">
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div key={unit}>
              <div className="text-2xl sm:text-3xl font-bold">{hasMounted ? timeLeft[unit] : `--:--:--`}</div>
              <div>{unit.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F2419C] hover:bg-[#ef6cb0] text-white px-5 py-2 rounded-full font-semibold text-sm sm:text-base transition"
        >
          RSVP FOR THIS WORKSHOP
        </button>
      </nav>

      {/* Hero */}
      <main className="flex mx-auto w-11/12 md:w-9/12 flex-col-reverse md:flex-row items-center justify-center px-6 py-4 md:px-16 md:py-32 gap-10">
        <div className="w-full md:w-1/2">
          <Image src="/coffe-deb.png" alt="Deb with laptop" width={400} height={200} className="rounded-lg w-full h-auto object-cover" />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
            Free Live Masterclass: <br />
            <span className="text-[#F2419C]">How To Tap Into Crypto & Web3 as a Woman in 2025</span>
          </h1>
          <p className="text-sm md:text-xl text-gray-700 mb-6">
            Whether you&apos;re new to crypto or already curious about the space, this session will show you how to start making moves, building real skills, and getting paid from the blockchain economy.
          </p>
          <p className="text-md text-[#F2419C] mb-6">
            📅 July 30th, 2025 6PM UTC
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block bg-[#F2419C] hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            SAVE MY FREE SPOT
          </button>
        </div>
      </main>

      {/* What You'll Learn */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-[#F2419C] mb-12">
          You're going to learn <em className="italic font-medium">all this...</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm md:text-base text-gray-800">
          {[
            "How crypto is opening doors for women globally and why it's not too late to start.",
            "The easiest and professionally recognised way to set up and understand pro web3 tools",
            "Proven ways women are earning from blockchain: from on-chain tasks to community roles.",
            "How to build a personal brand in crypto that attracts collabs, income, and freedom.",
          ].map((text, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl text-[#800000] mb-4">❤️</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For You / Not For You */}
      <section className="w-full px-6 py-16 flex flex-col gap-12 items-center">
        {/* For You */}
        <div className="w-full max-w-4xl bg-[#9b4dff]/60 rounded-3xl p-10">
          <h2 className="text-xl md:text-4xl font-bold text-[#fcfdf2] mb-8">
            This is for you if...
          </h2>
          <ul className="space-y-4">
            {[
              "You're curious about crypto but don't know where to start.",
              "You want to learn skills that actually pay in the digital world.",
              "You're ready to break free from traditional career paths.",
              "You want a supportive community of forward-thinking women in tech and finance.",
            ].map((text, i) => (
              <li key={i} className="flex items-center border-b border-dashed border-[#9b4dff]/50 pb-3">
                <div className="w-5 h-5 rounded-full bg-[#9b4dff] border-2 border-white mr-4 relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1 shadow"></div>
                </div>
                <p className="text-base text-[#333333]">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Not For You */}
        <div className="w-full max-w-4xl bg-[#333333] text-[#fcfdfd] rounded-3xl p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#9b4dff]/60 mb-6">
            This is not for you if...
          </h2>
          <ul className="space-y-4 text-[#dddddd]">
            {[
              "You're expecting overnight success with no effort.",
              "You’re not open to learning or exploring tech topics like wallets, crypto, or AI.",
              "You don’t believe women should be part of the future of money.",
              "You prefer staying confused instead of asking questions and taking action.",
              "You're not willing to invest a few hours into your growth and knowledge.",
            ].map((text, i) => (
              <li key={i} className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gray-400 border-2 border-white mr-4 relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1 shadow"></div>
                </div>
                <p className="text-base">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Freebie Section
      <section>
        <div className="bg-[#9b4dff]/60 text-center py-16 px-4 w-7/12 mx-auto rounded-3xl">
          <h2 className="text-xl md:text-2xl font-medium text  -white">
            Don&apos;t miss the workshop, i have <span className="font-bold text-[#F2419C]">Gift</span> for you babe.
          </h2>   
          </div>
      </section> */}

      {/* About Deb */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl font-extrabold text-[#333333] mb-4">Hi, I'm Deb</h2>
          <h3 className="text-md font-semibold uppercase tracking-wide text-[#F2419C] mb-6">
            Founder of GirlsInCryptoHub & Your Workshop Host
          </h3>
          <p className="text-base leading-relaxed text-[#333333] mb-4">
            I'm passionate about helping women tap into the wealth building power of crypto. I started Girls In Crypto Hub to give women access to the tools, communities, and opportunities that used to feel out of reach.
          </p>
          <p className="text-base leading-relaxed text-[#333333] mb-4">
            Through workshops, guides, and mentorship, I&apos;m here to help you get confident in crypto, learn high-value skills, and start building income streams that align with your dream lifestyle.
          </p>
          <p className="text-base leading-relaxed text-[#333333]">
            No matter your background you belong in this space. Let&apos;s open the doors and show the world what women can do in web3.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            src="/suit-deb.jpg"
            alt="Deb speaking to women"
            width={400}
            height={800}
            className="rounded-xl w-full object-cover"
          />
        </div>
      </section>

      {/* Final CTA */}
       <section>
        <div className="bg-[#F2419C]/60 text-center py-16 px-4">
          <h2 className="text-3xl md:text-5xl font-medium text-white">
            It&apos;s time to live your <span className="font-bold text-[#F2419C]">dream</span> life. Arise and shine, Babe!
          </h2>
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#F2419C] hover:bg-[#9b4dff]/60 text-white font-bold py-3 px-6 rounded-full text-lg"
            >
              JOIN THIS FREE LIVE MASTERCLASS
            </button>
          </div>
        </div>
      </section>
      <section className="md:w-9/12 w-11/12 mx-auto bg-[#e8d2ca] md:h-[100vh] flex items-center justify-center py-8 mt-16">
                  <div className="bg-[#eee9e7] w-11/12 md:w-10/12 mx-auto flex flex-col md:flex-row items-center justify-center px-4 font-space md:py-16">
                    <div className="mb-8 md:mb-0">
                      <div className="relative">
                        <Image
                          src={"/coffe-deb.png"}
                          alt="Guide Mockup"
                          width={400}
                          height={600}
                          className="w-8/12 md:w-[100%] shadow-lg mx-auto"
                        />
                      </div>
                    </div>
                    <div className="md:w-3/4 text-center md:text-left md:pl-20">
                      <p className="uppercase text-sm text-pink-500">Guide for Women</p>
                      <h1 className="text-4xl md:text-5xl font-bold leading-tight text-black">
                        The Hot Girl <br /> Crypto Mindset
                      </h1>
                      <p className="mt-4 text-gray-700 font-space pb-10">
                        Unlock dcryptgirl&apos;s Hot Girl Crypto Mindset guide and discover exactly what
                        it takes to build the confidence, clarity, and consistency to start making real
                        money in crypto. Whether you&apos;re trading, flipping, or building, this is your
                        blueprint to level up and thrive in Web3.
                      </p>
                      <div className="flex flex-col items-center md:items-start">
                      <Link href={'/Debs-Crypto-Investing-Starter-Pack.pdf'} target="_blank">
                        <button className="mt-6 border bg-[#F2419C] border-[#F2419C] text-white px-6 py-3 rounded-full hover:bg-transparent hover:text-[#F2419C] transition">
                          Get Your Free Guide →
                        </button>
                      </Link>
                      <Link href={'https://discord.gg/7P7zDTtHWb'} target="_blank" >
                        <button className="mt-6 border mb-10 bg-[#F2419C] border-[#F2419C] text-white px-6 py-3 rounded-full hover:bg-transparent hover:text-[#F2419C] transition">
                          Get updates in Discord →
                        </button>
                      </Link>
                      </div>
                    </div>
                  </div>
                </section>


      {/* Footer */}
      <footer className="bg-white text-center py-10 px-6 text-sm text-gray-900">
        <p className="mb-2">
          Copyright © 2025 <span className="font-medium">GirlsInCryptoHub.com</span> | All Rights Reserved |{" "}
          {/* <a href="#" className="text-teal-700 underline">Privacy Policy</a> |{" "}
          <a href="#" className="text-teal-700 underline">DMCA Policy</a> |{" "}
          <a href="#" className="text-teal-700 underline">Terms Of Service</a> */}
        </p>
        <p className="max-w-4xl mx-auto text-xs text-gray-700 mt-4 leading-relaxed">
          This website is operated by GirlsInCryptoHub💓. Content is for educational purposes only and not financial advice. Participation is voluntary, and results may vary depending on personal effort and circumstances.
        </p>
      </footer>
      <FreeclassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
    </>
  );
};

export default Freeclass;
