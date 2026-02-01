import Hero from "./components/Hero";
import Meetups from "./components/Meetups";
import RealResults from "./components/RealResults";
import QuoteSection from "./components/QuoteSection";
import Link from "next/link";


const testimonials = [
  {
    name: "Christine",
    message:
      "Sis. $15K. That's how much I've made since I started following your teachings. You showed me how to invest smart and gave me the confidence to stay in this space. You don't even know the impact you've had. Thank you 🙏🏾",
    avatar: "./christine.jpg",
  },
  {
    name: "Lizzie",
    message:
      "I’m officially on my DREAM offer! Feeling incredibly blessed to have this community...",
    avatar: "./lizzie.jpg",
  },
  {
    name: "Treasure",
    message:
      "You've been doing this for YEARS and never switched up. I remember the first ebook I got from you, now look at me — trading, saving in crypto, and explaining things to others. Thank you for being so consistent and generous 💜.",
    avatar: "./treasure.jpg",
  },
  {
    name: "Victoria",
    message:
      "Deb! Your free guides alone taught me more than half of the paid courses I wasted money on. Thank you for always showing up and pouring into us.",
    avatar: "./victoria.jpg",
  },
];

export default function CommunityPage() {
  return (
    <main className="font-space bg-white text-[#333]">
      <Hero />

      {/* Testimonials */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-pink-600">
          What Our Community is Saying 💬
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-pink-50 p-6 rounded-xl shadow-sm border border-pink-100 hover:shadow-md transition"
            >
              <div className="flex items-center mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full mr-4 border border-pink-300 object-cover"
                />
                <h3 className="text-lg font-semibold">{t.name}</h3>
              </div>
              <p className="text-sm text-gray-700 italic">“{t.message}”</p>
            </div>
          ))}
        </div>
      </section>

      <RealResults />
      <Meetups />
      <QuoteSection />

      {/* Call to Action */}
      <section className="text-center py-20 bg-gradient-to-b from-pink-100 to-white px-4">
        <h2 className="text-3xl font-bold text-pink-600">
          Ready to Join the Movement?
        </h2>
        <p className="mt-2 text-gray-700 max-w-xl mx-auto">
          Get access to exclusive masterclasses, community events, and crypto
          guides. Start learning, earning, and connecting.
        </p>
        <Link href="/bootcamp">
          <button className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg transition font-semibold shadow">
            Join the Bootcamp 💻
          </button>
        </Link>
      </section>
    </main>
  );
}
