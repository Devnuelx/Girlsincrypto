'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '../public/pink.png';

export default function Navbar() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsLightMode(true);
      document.body.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    if (newTheme) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <nav>
      <div className="logo cursor-pointer font-bold italic text-pink-500 text-2xl tracking-wide">
        girlsincrypto
      </div>
      <div className="nav-links hidden md:flex gap-8">
        <Link href="#home">Home</Link>
        <Link href="#free-class">Free Class</Link>
        <Link href="#video">For You</Link>
        <Link href="#products">Products</Link>
        <Link href="#community">Community</Link>
        <Link href="#about">About</Link>
      </div>
      <div className="nav-actions flex items-center gap-4">
        <button onClick={toggleTheme} className="theme-toggle text-xl">
          {isLightMode ? '🌙' : '☀️'}
        </button>
        <Link href="#products" className="nav-cta">
          Join the Hub
        </Link>
      </div>
    </nav>
  );
}
