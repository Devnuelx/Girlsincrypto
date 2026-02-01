import Link from "next/link";
import { LinkedIn, X, Instagram} from "@mui/icons-material";
import Tiktok from "../public/tiktok.svg";
import Image from "next/image";


const Footer = () => {
  return (
    <footer className="bg-[#fcfdf2] text-black font-space border-t-2 border-[#F2419C]">
      {/* Main Footer */}
      <div className="max-w-6xl w-11/12 mx-auto py-10 flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        
        {/* Logo */}
        <div className=" md:text-left">
          <span className="md:text-2xl text-xl font-semibold italic">Girls</span>
          <span className="md:text-2xl text-xl font-light ml-1">Incrypto🦋</span>
          <p className="text-xs mt-2 text-gray-600 md:max-w-[200px]">
            Building the future of women in blockchain, finance & crypto.
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm sm:text-base font-medium text-left md:text-left">
          <Link href="/">Home</Link>
          <Link href="/community">Success Stories</Link>
          <Link href="https://www.instagram.com/dcryptgirl?igsh=MWVrcWcycDJ5MGZxcA==">Our Founder</Link>
          <Link href="/freeclass">Get Freebies</Link>
          <Link href="/bootcamp">Certification</Link>
          <Link href="https://www.instagram.com/girlsincryptohub?igsh=NXo4aHUza29zNDA%3D&utm_source=qr">Talk To Our Team</Link>
        </div>

        {/* Social Media Links */}
        <div className="ml-[-15px] flex justify-start md:justify-end items-center gap-4">
          <Link
            href="https://www.linkedin.com/company/girlsincrypto/"
            target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-pink-600 hover:text-white transition"
          >
            <LinkedIn fontSize="small" />
          </Link>
          <Link
            href="https://x.com/girlscryptohub?s=21"
            target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-pink-600 hover:text-white transition"
          >
            <X fontSize="small" />
          </Link>
          <Link
            href="https://www.instagram.com/girlsincryptohub?igsh=NXo4aHUza29zNDA%3D&utm_source=qr"
            target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-pink-600 hover:text-white transition"
          >
            <Instagram fontSize="small" />
          </Link>
          <Link
            href="https://www.tiktok.com/@girlsincryptohub?_t=ZS-8yz2Mnu0HOU&_r=1"
            target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-pink-600 hover:text-white transition"
          >
            <Image src={Tiktok} className="w-6 h-6" height={''} width={""} alt="Tiktok Icon"/>
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1c1919] text-white text-sm text-center py-4">
        <p className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>© GirlsInCryptoHub 2025. All rights reserved</span>
          <span className="hidden sm:inline">|</span>
          <Link href="/#" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
