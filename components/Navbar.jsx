'use client';

import Image from 'next/image';
import Logo from '../public/pink.png';
import TikTok from '../public/tiktok.svg';
import { Menu, X } from 'lucide-react';
import { LinkedIn, X as Twitter, Instagram } from '@mui/icons-material';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="w-full py-4 border-b border-pink-500 shadow-sm fixed bg-[#fcfdf2] z-40">
        <div className="max-w-7xl w-11/12 mx-auto flex justify-between items-center relative font-mono">
          
          {/* Left Links (desktop & up) */}
          <div className="hidden lg:flex gap-6">
            <a href="/bootcamp" className="text-sm font-medium text-black">OUR PROGRAM</a>
            <a href="/community" className="text-sm font-medium text-black">OUR STUDENTS</a>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Image src={Logo} alt="Logo" className="w-14 h-auto" />
          </div>

          {/* Right side (desktop & up) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Inline socials */}
            <div className="flex items-center gap-3">
              <a href="https://x.com/girlscryptohub?s=21" target="_blank" rel="noopener noreferrer" className="social-btn"><Twitter className="w-4 h-4" /></a>
              <a href="https://www.instagram.com/girlsincryptohub" target="_blank" rel="noopener noreferrer" className="social-btn"><Instagram className="w-4 h-4" /></a>
              <a href="https://www.tiktok.com/@girlsincryptohub" target="_blank" rel="noopener noreferrer" className="social-btn"><Image src={TikTok} alt="TikTok" className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/company/girlsincrypto/" target="_blank" rel="noopener noreferrer" className="social-btn"><LinkedIn className="w-4 h-4" /></a>
            </div>

            {/* Text links */}
            <a href="https://www.instagram.com/dcryptgirl" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-black">OUR FOUNDER</a>
            <a href="/bootcamp" className="px-4 py-2 bg-[#F2419C] text-white rounded-full text-sm font-medium shadow hover:bg-pink-600">STUDENT PORTAL</a>
          </div>

          {/* Mobile & Tablet Hamburger (<lg) */}
          <button className="lg:hidden ml-auto pr-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-7 h-7 text-black" /> : <Menu className="w-7 h-7 text-black" />}
          </button>
        </div>
      </nav>

      {/* Mobile/Tablet menu */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-[#fcfdf2] flex flex-col items-center text-center gap-8 text-lg font-semibold pt-32 font-mono">
          <a href="/" onClick={() => setIsOpen(false)}>HOME</a>
          <a href="/bootcamp" onClick={() => setIsOpen(false)}>GET CERTIFIED</a>
          <a href="/community" onClick={() => setIsOpen(false)}>STUDENT STORIES</a>
          <a href="https://www.instagram.com/dcryptgirl" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>ABOUT DEB</a>
          <a href="/bootcamp" onClick={() => setIsOpen(false)} className="bg-pink-500 text-white px-6 py-2 rounded-full shadow hover:bg-pink-600">STUDENT LOGIN</a>

          {/* Socials inside mobile menu */}
          <div className="flex gap-5 mt-8">
            <a href="https://x.com/girlscryptohub?s=21" target="_blank" rel="noopener noreferrer" className="social-btn"><Twitter className="w-5 h-5" /></a>
            <a href="https://www.instagram.com/girlsincryptohub" target="_blank" rel="noopener noreferrer" className="social-btn"><Instagram className="w-5 h-5" /></a>
            <a href="https://www.tiktok.com/@girlsincryptohub" target="_blank" rel="noopener noreferrer" className="social-btn"><Image src={TikTok} alt="TikTok" className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/company/girlsincrypto/" target="_blank" rel="noopener noreferrer" className="social-btn"><LinkedIn className="w-5 h-5" /></a>
          </div>
        </div>
      )}

      {/* Reusable btn class */}
      <style jsx>{`
        .social-btn {
          @apply w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-pink-600 hover:text-white transition;
        }
      `}</style>
    </>
  );
}
