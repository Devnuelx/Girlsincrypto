import Image from "next/image";
import Link from "next/link";


export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 font-space">
      <div className="max-w-md w-full text-center space-y-6">
       
        {/* Success Message */}
        <h1 className="text-3xl font-bold text-pink-500">🎉Good to Have you Girl!!</h1>

         {/* GIF Section */}
        <div className="w-full">
          <img
            src="https://i.gifer.com/atw.gif"
            alt="Ladies hugging"
            className="mx-auto rounded-xl shadow-md w-[100%] h-auto"
          />
        </div>
        <p className="text-gray-700">
          Thank you for joining <strong>GirlsinCryptoHub</strong>!🚀
        </p>
        <p className="text-gray-600">
          Your spot is confirmed. Check your email for next steps.
        </p>
        
        <p className="text-gray-600">Join the Discord group:</p>

        {/* Telegram Button */}
        <a
          href="https://discord.gg/7P7zDTtHWb"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 text-white bg-pink-500 rounded-lg hover:bg-pink-600"
        >
          Join Discord
        </a>

        <p className="text-base font-semibold">Send screenshot to mod or admin to get access</p>

        {/* Back Home */}
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
