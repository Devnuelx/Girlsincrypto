'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Link from 'next/link';

// Placeholder or available assets
// Mapped from public/ directory scan
const assets = {
  heroBg: '/pink.png', // Fallback
  community1: '/students.svg',
  community2: '/the-girls.svg',
  community3: '/women.jpg',
  founderDeb: '/suit-deb.jpg', // Using available Deb image
  founderMilana: '/milana.jpg', // Updated Milana image
};

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch products from backend
  useState(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setBackendProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Find matching backend product
    const backendProduct = backendProducts.find(p => p.title === selectedProduct.name);
    // Fallback if not found (or seeding issue) - rely on hardcoded for logic
    const productId = backendProduct ? backendProduct.id : null;

    if (!productId && selectedProduct.type !== 'mentorship') {
      alert("Product not available for purchase yet. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    if (selectedProduct.type === 'mentorship') {
      window.location.href = 'https://calendly.com/girlsincrypto/onboarding';
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const name = formData.get('name');

      const res = await fetch('http://localhost:3001/api/payments/initialize-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email, name }),
      });

      if (!res.ok) throw new Error('Payment initialization failed');

      const data = await res.json();
      window.location.href = data.link; // Redirect to Flutterwave
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please check your connection.");
      setIsSubmitting(false);
    }
  };

  const handleLeadCapture = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const payload = {
      tenantSlug: 'gich', // Default tenant
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'), // WhatsApp
      source: 'LANDING_PAGE'
    };

    try {
      const res = await fetch('http://localhost:3001/api/webhooks/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server Error ${res.status}`);
      }

      alert("Success! You're on the list.");
      setLeadModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(`Error registering: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const products = [
    // {
    //   name: "Crypto Beginners Guide",
    //   price: 99,
    //   description: "Master the fundamentals of cryptocurrency from wallet setup to your first trade.",
    //   features: [
    //     "Eight comprehensive modules",
    //     "Wallet setup tutorials",
    //     "Exchange walkthroughs",
    //     "Security best practices",
    //     "Community access"
    //   ],
    //   type: "ebook"
    // },
    {
      name: "Crypto Investing Starterpack",
      price: 99,
      description: "Your complete guide to starting your crypto investment journey with confidence.",
      features: [
        "Step-by-step investment framework",
        "Risk management strategies",
        "Portfolio building templates",
        "Top 20 cryptocurrencies analyzed",
        "Community access"
      ],
      type: "ebook"
    },
    // {
    //   name: "The Memecoin Edge",
    //   price: 99,
    //   description: "Navigate the world of memecoins with proven strategies and insider knowledge.",
    //   features: [
    //     "Memecoin identification framework",
    //     "Community analysis techniques",
    //     "Entry and exit strategies",
    //     "Risk management for volatile assets",
    //     "Community access"
    //   ],
    //   type: "ebook"
    // },
    // {
    //   name: "Understanding Web3",
    //   price: 99,
    //   description: "Comprehensive guide to blockchain technology, the decentralized web, and landing your dream Web3 career.",
    //   badge: "BONUS: WEB3 CAREER GUIDE INCLUDED",
    //   features: [
    //     "Web3 fundamentals explained",
    //     "Blockchain technology deep dive",
    //     "Smart contract basics",
    //     "DeFi ecosystem overview",
    //     "Career roadmap and job strategies",
    //     "Resume and portfolio templates",
    //     "Interview preparation guide",
    //     "Community access"
    //   ],
    //   type: "ebook"
    // },
    {
      name: "One Week Onboarding",
      price: 599,
      description: "Personalized 1-on-1 guidance to accelerate your crypto journey.",
      features: [
        "Four 1-on-1 sessions over one week",
        "Personalized learning roadmap",
        "Direct access via messaging",
        "Portfolio review and feedback",
        "Community access"
      ],
      type: "mentorship",
      buttonText: "Onboard Me"
    }
  ];

  return (
    <>
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
      </div>
      <div className="grain"></div>
      <div className="floating-particles" id="floatingParticles"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="hero-label">FOR WOMEN BUILDING WEALTH</p>
          <h1><em>Your Crypto</em><br />Journey Starts<br />Here</h1>
          <p className="hero-subtitle">
            Master crypto investing, DeFi, memecoin trading, and Web3 careers. Built by women, uninterrupted by the crypto bro culture.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a href="#products" className="cta-button">Join the Hub</a>
            <a href="#free-class" className="inline-block px-12 py-5 border-2 border-[var(--pink)] text-[var(--cream)] rounded-full font-bold text-sm tracking-wide transition-all duration-400 hover:bg-[var(--pink)] hover:text-white hover:-translate-y-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_1s_forwards]">
              Start with Free Class →
            </a>
          </div>
        </div>
      </section>

      {/* Free Class Section */}
      <section className="free-class-cta" id="free-class">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(242,65,156,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <div className="inline-block px-6 py-2 bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white rounded-full text-xs font-bold uppercase tracking-[1.5px] mb-8 shadow-[0_4px_20px_rgba(255,215,0,0.4)]">
            🎁 Free Masterclass
          </div>
          <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-bold mb-6 tracking-[-0.01em] leading-[1.1] font-playfair">
            Master Crypto <em className="italic text-[var(--pink)]">Fundamentals</em><br />in One Hour
          </h2>
          <p className="text-xl opacity-75 mb-12 leading-relaxed max-w-[700px] mx-auto">
            Join thousands of women who started their crypto journey with us. Learn wallet setup, exchange basics, and top strategies. No experience needed.
          </p>
          <button onClick={() => setLeadModalOpen(true)} className="free-class-btn inline-block px-14 py-6 bg-gradient-to-br from-[var(--pink)] to-[var(--pink-dark)] text-white no-underline rounded-full font-bold text-base tracking-[0.5px] transition-all shadow-[0_10px_40px_rgba(242,65,156,0.4)] relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(242,65,156,0.5)] cursor-pointer border-none">
            Reserve Your Spot — It&apos;s Free
          </button>
          <p className="mt-8 text-sm opacity-50 tracking-wider">✓ Live Q&A Session • ✓ Beginner-Friendly • ✓ Limited Spots</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">Women Empowered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <blockquote>&quot;The system that makes you money in crypto.&quot;</blockquote>
        <cite>— DEB, FOUNDER</cite>
      </section>

      {/* Video Section */}
      <section className="video-section" id="video">
        <div className="video-content">
          <p className="section-label">WATCH NOW</p>
          <h2>This Is <em>For You</em></h2>
          <p>Watch how we&apos;re transforming women&apos;s lives through crypto education</p>
          <div className="video-container">
            <div className="video-placeholder">
              <div className="video-placeholder-icon">▶</div>
              <div className="text-lg">Your video goes here</div>
              <div className="text-sm opacity-50">Replace with your video embed code</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products" id="products">
        <div className="products-header">
          <p className="section-label">OUR PROGRAMS</p>
          <h2><em>Start Here</em></h2>
          <p>CURATED FOR BUILDING REAL WEALTH</p>
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              {product.badge && <span className="badge">{product.badge}</span>}
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <ul className="product-features">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <div className="price">${product.price}</div>
              <button
                className="buy-button"
                onClick={() => openModal(product)}
              >
                {product.buttonText || "Get Access"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive / Why Us Section */}
      <section className="interactive-section">
        <div className="text-center mb-12 relative z-10">
          <p className="section-label text-white">WHY US</p>
          <h2 className="font-playfair text-[clamp(3rem,6vw,5rem)] font-bold mb-4 text-white tracking-[-0.01em]"><em>Why girlsincrypto?</em></h2>
          <p className="text-lg opacity-90 text-white">We simplify crypto and Web3</p>
        </div>
        <div className="interactive-grid">
          <div className="interactive-card">
            <h3>Overwhelmed by jargon?</h3>
            <p>We break down complex crypto concepts into simple, actionable strategies anyone can understand.</p>
          </div>
          <div className="interactive-card">
            <h3>Not sure where to invest?</h3>
            <p>Get clear frameworks for portfolio building, risk management, and identifying opportunities.</p>
          </div>
          <div className="interactive-card">
            <h3>Want to transition to Web3?</h3>
            <p>Learn exactly how to position yourself for Web3 careers and build a standout portfolio.</p>
          </div>
          <div className="interactive-card">
            <h3>Need community support?</h3>
            <p>Join thousands of women supporting each other on their journey to financial freedom.</p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="community" id="community">
        <div className="community-header">
          <p className="section-label">OUR TRIBE</p>
          <h2>Join the <em>Community</em></h2>
          <p>Connect with thousands of women building wealth and careers in Web3</p>
        </div>
        <div className="community-images">
          <div className="community-image relative h-[500px]">
            <Image src={assets.community1} alt="Community 1" fill className="object-cover" />
          </div>
          <div className="community-image relative h-[500px]">
            <Image src={assets.community2} alt="Community 2" fill className="object-cover" />
          </div>
          <div className="community-image relative h-[500px]">
            <Image src={assets.community3} alt="Community 3" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="founders">
        <div className="founders-header">
          <p className="section-label">LEADERSHIP</p>
          <h2>Meet the Founders</h2>
        </div>
        <div className="founders-grid">
          <div className="founder-card">
            <div className="founder-image relative">
              <Image src={assets.founderDeb} alt="Deb" fill className="object-cover" />
            </div>
            <h3 className="founder-name">Deb</h3>
            <p className="founder-title">Co-Founder</p>
            <p className="founder-instagram">@debifegwu</p>
            <p className="founder-bio">
              Crypto investor and educator on a mission to empower women in crypto. Five years building wealth in cryptocurrency markets.
            </p>
          </div>
          <div className="founder-card">
            <div className="founder-image relative">
              <Image src={assets.founderMilana} alt="Milana" fill className="object-cover" />
            </div>
            <h3 className="founder-name">Milana</h3>
            <p className="founder-title">Co-Founder</p>
            <p className="founder-instagram">@milana_tashmetova</p>
            <p className="founder-bio">
              Web3 strategist and community builder dedicated to creating inclusive spaces for women in crypto and blockchain technology.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-content">
          <h2>About Us</h2>
          <p>We started girlsincrypto because we saw too many talented women sitting on the sidelines of the Web3 revolution. Too intimidated. Too confused. Too discouraged by the crypto bro culture.</p>
          <p>We&apos;ve been where you are. We know what it feels like to be overwhelmed by technical jargon, to second-guess every investment decision, to wonder if you belong in this space.</p>
          <p><strong>Here&apos;s the truth: you do belong. And we&apos;re here to prove it.</strong></p>
          <p>Every guide, every resource, every piece of content we create is designed with one goal: to give you the confidence, knowledge, and community you need to build real wealth in crypto and Web3.</p>
          <p><strong>Because when women win in crypto, we all win.</strong></p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2026 girlsincrypto. Empowering women in crypto.</p>
        <p className="mt-4"><a href="mailto:contact@girlsincrypto.com" className="opacity-50 hover:opacity-100 transition">contact@girlsincrypto.com</a></p>
      </footer>

      {/* Modal */}
      <div className={`modal ${modalOpen ? 'active' : ''}`} onClick={(e) => e.target.classList.contains('modal') && closeModal()}>
        <div className="modal-content relative">
          <button className="close-modal text-black" onClick={closeModal}>&times;</button>
          {selectedProduct && (
            <>
              <h2>{selectedProduct.name}</h2>
              <div className="modal-price">${selectedProduct.price}</div>
              <form onSubmit={handlePurchase}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" required placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" required placeholder="Jane Doe" />
                </div>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="spinner"></span>
                  ) : (
                    "Complete Purchase"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      {/* Lead Capture Modal */}
      <div className={`modal ${leadModalOpen ? 'active' : ''}`} onClick={(e) => e.target.classList.contains('modal') && setLeadModalOpen(false)}>
        <div className="modal-content relative">
          <button className="close-modal text-black" onClick={() => setLeadModalOpen(false)}>&times;</button>
          <h2>Join the Masterclass</h2>
          <p className="mb-4 text-center opacity-70">Enter your details to get the free link.</p>
          <form onSubmit={handleLeadCapture}>
            <div className="form-group">
              <label>Name</label>
              <input name="name" type="text" required placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" required placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>WhatsApp (Optional)</label>
              <input name="phone" type="tel" placeholder="+1234567890" />
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner"></span> : "Register Free"}
            </button>
          </form>
        </div>
      </div >
    </>
  );
}