
'use client';
import Image from 'next/image';
import Logo from '../public/pink.png';
import Footer from '../components/Footer';
import tab from '../public/tab.svg';
import laptop from '../public/laptop.svg';
import iphone from '../public/iphone.svg';
import desktop from '../public/monitor.svg';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import Free from '../public/free-deb.svg';
import All from '../public/the-girls.svg';
import Suite from '../public/suite-deb.svg';
import Student from '../public/students.svg';
import Liedown from '../public/lie-deb.jpg';
import Script from 'next/script';
import Coffe from '../public/coffe-deb.png';
import { useEffect, useRef, useState } from 'react';
import Freebie from '../components/Freebie';

const Hero = () => {
  const [showPopup, setShowPopup] = useState(false);
  const clickedRef = useRef(false);
  const observerTargetRef = useRef(null); // Ref for the section after the freebie




  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const endDate = new Date('2025-08-29T23:59:59'); // adjust as needed

    const updateCountdown = () => {
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown(); // initial call
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !clickedRef.current) {
          setTimeout(() => {
            setShowPopup(true);
          }, 5000); // Show popup 5 seconds after the target section is in view
        }
      },
      { threshold: 0.5 }
    );

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    return () => {
      if (observerTargetRef.current) {
        observer.unobserve(observerTargetRef.current);
      }
    };
  }, []);

  const handleFreebieClick = () => {
    clickedRef.current = true;
  };

  return (
    <>
      <Script id="ld-org-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'GirlsinCryptoHub',
          'alternateName': 'Girls in Crypto',
          'url': 'https://girlsincryptohub.com',
          'logo': 'https://girlsincryptohub.com/pink.png',
          'sameAs': [
            'https://www.instagram.com/girlsincryptohub?igsh=NXo4aHUza29zNDA%3D&utm_source=qr',
            'https://x.com/girlscryptohub?s=21',
          ],
          'description':
            'GirlsinCryptoHub is the #1 female crypto community where women learn, earn, and grow in Web3. From bootcamps to real-world income skills, we help you level up in crypto—no tech background needed.',
        })}
      </Script>

      <Script id="ld-website-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'GirlsinCryptoHub',
          'url': 'https://girlsincryptohub.com',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://girlsincryptohub.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        })}
      </Script>

      <div className="bg-[#fcfdf2]">
        <Navbar />
        <section className="relative bg-[#fcfdf2] font-mono overflow-hidden z-10">
          <div className="max-w-7xl w-full mx-auto flex flex-col justify-center md:flex-row items-center h-screen relative">
            {/* Left Side: Images */}
            <div className="">
              <div className="w-56 absolute top-[8vh] left-[-10vw] md:w-96 transform md:-rotate-6 -rotate-12">
                <Image src={laptop} alt="Laptop with women" className="rounded-md" />
              </div>
              <div className="w-36 md:w-60 rotate-12 md:rotate-6 absolute right-[-32px] bottom-0 md:right-[-12vw]">
                <Image src={tab} alt="Phone UI" className="rounded-md" />
              </div>
              <div className="w-24 left-[-30px] transform -rotate-6 absolute bottom-0 md:w-32 md:left-0">
                <Image
                  src={iphone}
                  alt="Female founder"
                  width={128}
                  height={100}
                  className="rounded-md"
                />
              </div>
            </div>

            {/* Right Side: Text */}
            <div className="relative text-center z-20 flex justify-items-center items-center flex-col md:text-center w-full md:w-1/2 space-y-6 md:pt-20">
              <h1 className="text-3xl md:text-3xl font-semibold text-gray-900 font-space">
                #1 FEMALE CRYPTO COMMUNITY
              </h1>
              <p className="text-gray-700 text-[15px] md:text-base w-6/7 font-space">
                An exclusive girls only 8 weeks bootcamp where you&apos;ll master crypto
                investing, understand Web3, and unlock new money opportunities
                <br />
                No tech background needed.
              </p>
              <a
                href="/bootcamp" className="inline-block px-8 py-3 bg-[#F2419C] text-white rounded-md text-base font-semibold md:text-x hover:bg-pink-500 transition"
              >
                JOIN THE GIRLS →
              </a>

              <div className="w-8 md:hidden md:w-20 transform rotate-6 absolute top-3 left-20">
                <Image src={Logo} alt="Creator list" className="rounded-md" />
              </div>
            </div>
            <div className="w-52 md:w-60 transform rotate-20 md:rotate-6 absolute right-[-150px] md:right-[-10vw] top-32">
              <Image src={desktop} alt="Video intro" className="rounded-md" />
            </div>
          </div>
        </section>

        {/* <section className="bg-[#fff4fa] py-12 px-6 text-center font-space border border-pink-200 rounded-xl w-9/12 mx-auto my-12 shadow-sm">
        <p className="flex items-center justify-center gap-2 text-red-600 font-bold uppercase text-sm animate-pulse">
        <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
        🔥Live Now: Bootcamp Session in Progress
        </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3d3d] mt-2">
          We are live!
          </h2>
          <p className="text-base text-pink-600 mt-2 font-semibold">
            Cohort is Live!
          </p>

          <p className="mt-3 text-gray-700 text-base md:text-lg">
            Master crypto, start earning, and connect with the most supportive girl gang online.
            No tech background needed.
          </p>
          <Link href="/bootcamp">
            <button className="mt-6 bg-[#F2419C] text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-500 transition">
              See What’s Inside →
            </button>
          </Link>
        </section> */}

        {/* Call to Action Section */}
        <section className="mb-20 md:w-9/12 w-10/12 mx-auto py-30 px-4 flex flex-col md:flex-row items-center justify-center gap-8 mt-32">
          <div className="text-center h-[350px] md:h-[450px] relative w-full md:w-1/3">
            <Link href={'/bootcamp'}>
              <Image
                src={Liedown}
                alt="Join Waitlist"
                className="w-full h-full object-cover object-top shadow-lg grayscale hover:grayscale-0 cursor-pointer"
              />
              <h3 className="text-3xl font-bold text-[#3d3d3d] absolute bottom-20 left-0 right-0 mx-auto w-11/12 font-space text-center">
                Join The <br />
                <span className="font-play text-4xl text-[#fb2594]">Girls</span>
              </h3>
            </Link>
          </div>

          <div className="text-center h-[350px] md:h-[450px] relative w-full md:w-1/3">
            <Link href={'/community'}>
              <Image
                src={Student}
                alt="Join Waitlist"
                className="w-full h-full object-cover shadow-lg grayscale"
              />
              <h3 className="text-3xl font-bold text-[#3d3d3d] absolute bottom-20 left-0 right-0 mx-auto w-11/12 font-space text-center">
                Meet Our <br />
                <span className="font-play text-4xl text-[#fb2594]">Students</span>
              </h3>
            </Link>
          </div>

          <div
            ref={observerTargetRef}
            onClick={handleFreebieClick}
            className="text-center h-[350px] md:h-[450px] relative w-full md:w-1/3"
          >
            <Link href={'/freeclass'}>
              <Image
                src={Free}
                alt="Join Waitlist"
                className="w-full h-full object-cover object-top shadow-lg grayscale hover:grayscale-0"
              />
              <h3 className="text-3xl font-bold text-[#3d3d3d] absolute bottom-20 left-0 right-0 mx-auto w-11/12 font-space text-center">
                Get The <br />
                <span className="font-play text-4xl text-[#fb2594]">Freebie</span>
              </h3>
            </Link>
          </div>
        </section>

        {/* About deb Section */}
        <section className="font-space md:w-9/12 w-10/12 mx-auto py-16 px-4 flex flex-col md:flex-row items-center justify-center">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <Image
              src={Suite}
              alt="Pretty deb sitting"
              className="w-full md:h-[700px] object-cover shadow-lg"
            />
          </div>
          <div className="md:w-8/12 text-center md:text-left md:pl-8">
            <p className="text-xl text-[#F2419C] italic font-semibold text-left">hey ladies</p>
            <h2 className="text-3xl md:text-4xl text-black font-bold text-left">
              It&apos;s Your Crypto Big sis, Deb!
            </h2>
            <p className="mt-4 text-gray-700 text-justify">
              Maybe you found me through one of my trading videos… or a reel on how to invest,
              or how to earn online while traveling the world. Maybe it was something about
              working remotely. I am not sure which video brought you here, but I&apos;m glad it
              did. Because this? This is where the real shift starts
            </p>
            <p className="mt-2 text-gray-700 text-justify">
              I built GirlsinCryptoHub for women like us the ones who want more. More freedom,
              more income, more clarity, more confidence. And when I asked myself, “What did my
              younger self really need?
            </p>
            <p className="mt-2 text-gray-700 text-justify">
              the answer was clear. She needed:<br />
              <br />– A way to learn how money actually works <br />– Real digital skills to start
              earning <br />– And a space where women weren&apos;t gatekeeping game-changing
              info <br />
              So I created it.. a platform, a playbook, and a powerful community. You&apos;ve
              probably seen glimpses of my life, the soft girl tech era, the travel, the lifestyle
              but what I&apos;m building goes deeper. It&apos;s about helping more women build real
              income, create options, and glow up unapologetically.<br />
              <br />
              If you&apos;re ready to step into that version of you? Let&apos;s get to work
            </p>
            <Link
              href={
                'https://www.instagram.com/dcryptgirl?igsh=MWVrcWcycDJ5MGZxcA=='
              }
            >
              <button className="mt-6 bg-transparent border border-[#F2419C] text-[#F2419C] px-6 py-3 rounded-full hover:bg-[#F2419C] cursor-pointer hover:text-white transition">
                More About Me →
              </button>
            </Link>
          </div>
        </section>

        <div className="">
          {/* Testimonial Section */}
          <section className="w-11/12 md:w-9/12 mx-auto bg-[#4FB1B8] py-20 text-white md:py-40 text-center font-space">
            <p className="text-base italic">Alice says...</p>
            <h2 className="text-2xl md:text-5xl font-bold mt-4">
              &quot;I literally changed my life in a matter of one month.&quot;
            </h2>
            <Link href="/community">
              <button className="mt-6 text-blue-200 underline">Read More Here →</button>
            </Link>
          </section>

          {/* Success Stories Section */}
          <section className=" md:w-9/12 w-11/12 py-16 flex flex-col md:flex-row items-center justify-center mx-auto">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image
                src={All}
                alt="Students on Boat"
                className="w-full md:w-11/12 rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 text-center md:text-left md:pl-8 pt-16">
              <h2 className="text-3xl md:text-4xl font-space text-black">
                Discover how 100+ of women like you have become{' '}
                <span className="italic font-gara">certified crypto badass </span>
                and changed their lives
              </h2>
              <button className="mt-6 bg-transparent border border-[#F2419C] text-[#F2419C] px-6 py-3 rounded-full hover:bg-[#F2419C] hover:text-white transition cursor-pointer">
                Read Student Stories →
              </button>
            </div>
          </section>

          {/* Waitlist Section */}
          <section className="py-16 px-4 10/12 md:w-9/12 mx-auto text-center font-space md:bg-[url('/dollar.jpg')] bg-cover bg-center bg-no-repeat bg-opacity-20">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-black md:py-16 ">
                Level The F*ck Up!
              </h2>
              <p className="mt-4 text-gray-700">
                If you you want to join the most badass women only crypto training program, get
                certified and have the support of likeminded women in the corner and create the
                dream lifestyle you deserve, you are in the right place.
              </p>
              <Link href="/bootcamp">
                <button className="mt-6 bg-[#F2419C] text-white px-6 py-3 rounded-full hover:bg-[#F2419C] transition">
                  Join The Girls →
                </button>
              </Link>
            </div>
          </section>
          {/* Final cta */}
          {/* <section className="bg-[#fff4fa] py-12 px-6 text-center font-space border border-pink-200 rounded-xl w-9/12 mx-auto my-12 shadow-sm">
            <p className="uppercase text-sm text-pink-600 font-bold tracking-wider">🔥 Limited-Time Offer</p>

            <h2 className="text-3xl md:text-4xl font-bold text-[#3d3d3d] mt-2">
              Join the Bootcamp for 
              <span className="text-[#F2419C]"> $199</span>
            </h2>

            <p className="text-base text-pink-600 mt-2 font-semibold">
              Time is ticking babe: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </p>

            <p className="mt-3 text-gray-700 text-base md:text-lg">
              Master crypto, start earning, and connect with the most supportive girl gang online.
              No tech background needed.
            </p>

            <p className="mt-4 text-gray-700 text-sm md:text-base max-w-3xl mx-auto">
              This isn&apos;t your average free webinar or fluffy course. This is 8 weeks of real crypto education, 
              Web3 tools, and money making strategy designed specifically for women. 
              If we were pricing it based on value (and girl, we should), this would easily be worth over <strong>$500</strong>.
              But right now? You&apos;re getting access for <strong>$199</strong> because we&apos;re all about breaking barriers, not wallets.
            </p>

            <Link href="/bootcamp">
              <button className="mt-6 bg-[#F2419C] text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-500 transition">
                See What&apos;s Inside →
              </button>
            </Link>
          </section> */}


          <section className="bg-[#fff4fa] py-12 px-6 text-center font-space border border-pink-200 rounded-xl w-9/12 mx-auto my-12 shadow-sm">
            <p className="uppercase text-sm text-pink-600 font-bold tracking-wider">🔥 Limited-Time Offer</p>

            <h2 className="text-3xl md:text-4xl font-bold text-[#3d3d3d] mt-2">
              We are Live!
            </h2>

            <p className="mt-3 text-gray-700 text-base md:text-lg">
              Master crypto, start earning, and connect with the most supportive girl gang online.
              No tech background needed.
            </p>

            <Link href="/bootcamp">
              <button className="mt-6 bg-[#F2419C] text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-500 transition">
                See What&apos;s Inside →
              </button>
            </Link>
          </section>



          <section className="md:w-9/12 w-11/12 mx-auto bg-[#e8d2ca] md:h-[100vh] flex items-center justify-center py-8 mt-16">
            <div className="bg-[#eee9e7] w-11/12 md:w-10/12 mx-auto flex flex-col md:flex-row items-center justify-center px-4 font-space md:py-16">
              <div className="mb-8 md:mb-0">
                <div className="relative">
                  <Image
                    src={Coffe}
                    alt="Guide Mockup"
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
                <Link href={'/Debs-Crypto-Investing-Starter-Pack.pdf'}>
                  <button className="mt-6 border mb-10 bg-[#F2419C] border-[#F2419C] text-white px-6 py-3 rounded-full hover:bg-transparent hover:text-[#F2419C] transition">
                    Get Your Guide →
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
      <Freebie show={showPopup} setShow={setShowPopup} />
    </>
  );
};

export default Hero;