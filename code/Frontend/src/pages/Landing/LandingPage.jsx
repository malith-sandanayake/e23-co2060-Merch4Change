import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import {
  ShoppingBag,
  Heart,
  TrendingUp,
  ShieldCheck,
  BarChart2,
  Award,
  Users,
} from "lucide-react";

const HEADLINES = [
  { before: "Stay Connected with your", highlight: "Favourite Brands" },
  { before: "Shop with", highlight: "Purpose.", after: "Give with Heart." },
  { before: "Every Purchase", highlight: "Funds", after: "a Cause." },
  { before: "Wear your", highlight: "Values", after: "on your Sleeve." },
  { before: "Discover Merch that", highlight: "Matters." },
];

function LandingPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Animated headline rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % HEADLINES.length);
        setIsVisible(true);
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* SECTION 1 — HERO */}
      <section id="hero" className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero-inner">
            {/* Left Column */}
            <div className="lp-hero-left">
              <div className="lp-hero-badge">Impact-driven shopping</div>

              <div className="lp-hero-headline-wrap">
                <h1
                  className={`lp-hero-headline ${
                    isVisible ? "lp-headline-visible" : "lp-headline-hidden"
                  }`}
                >
                  {HEADLINES[currentIndex].before}{" "}
                  <em>{HEADLINES[currentIndex].highlight}</em>
                  {HEADLINES[currentIndex].after
                    ? ` ${HEADLINES[currentIndex].after}`
                    : ""}
                </h1>
              </div>

              <div className="lp-hero-slogan">
                Connect · Act · Impact · Shop
              </div>

              <p className="lp-hero-desc">
                Merch4Change connects shoppers, donors, and organisations on
                one platform. Every purchase supports a cause that matters.
              </p>

              <div className="lp-hero-cta-row">
                <button
                  className="lp-btn lp-btn-primary"
                  onClick={() => navigate("/marketplace")}
                >
                  Start shopping
                </button>
                <button
                  className="lp-btn lp-btn-ghost"
                  onClick={() => scrollTo("how-it-works")}
                >
                  How it works
                </button>
              </div>

              <div className="lp-hero-social-proof">
                <div className="lp-avatars">
                  <div className="lp-avatar lp-avatar-1">AK</div>
                  <div className="lp-avatar lp-avatar-2">SR</div>
                  <div className="lp-avatar lp-avatar-3">DM</div>
                </div>
                <p className="lp-social-proof-text">
                  Join 2,400+ people making a difference
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="lp-hero-right">
              <div className="lp-card-stack">
                <div className="lp-card lp-card-back"></div>
                <div className="lp-card lp-card-mid"></div>
                <div className="lp-card lp-card-front">
                  <div className="lp-card-header">
                    <div className="lp-card-dot"></div>
                    <span className="lp-card-title">Eco Tote Bag</span>
                    <span className="lp-card-price">$24</span>
                  </div>
                  <div className="lp-card-image">
                    <ShoppingBag size={32} color="#d0c8f8" />
                  </div>
                  <div className="lp-card-footer">
                    <p className="lp-card-support">
                      Supports: Clean Lanka NGO
                    </p>
                    <button className="lp-card-badge">Shop now</button>
                  </div>
                </div>
              </div>

              <div className="lp-stats-pills">
                <div className="lp-pill lp-pill-primary">
                  $120K+ donated
                </div>
                <div className="lp-pill lp-pill-secondary">340+ campaigns</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — TRUST BAR */}
      <section className="lp-trust">
        <div className="lp-container">
          <p className="lp-trust-label">
            Trusted by organisations across Sri Lanka
          </p>
          <div className="lp-trust-names">
            <span>Clean Lanka</span>
            <span className="lp-trust-dot">·</span>
            <span>EcoWear</span>
            <span className="lp-trust-dot">·</span>
            <span>Hope Foundation</span>
            <span className="lp-trust-dot">·</span>
            <span>GreenPulse</span>
            <span className="lp-trust-dot">·</span>
            <span>Impact Co.</span>
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS */}
      <section id="how-it-works" className="lp-how-it-works">
        <div className="lp-container">
          <div className="lp-section-header">
            <p className="lp-eyebrow">How it works</p>
            <h2 className="lp-section-title">
              Three steps to shop with <em>purpose</em>
            </h2>
            <p className="lp-section-desc">
              It's simple, transparent, and impactful.
            </p>
          </div>

          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-number">01</div>
              <ShoppingBag size={26} className="lp-step-icon" />
              <h3 className="lp-step-title">Browse the marketplace</h3>
              <p className="lp-step-desc">
                Discover thousands of impact products from verified
                organisations and creators across Sri Lanka.
              </p>
            </div>

            <div className="lp-step-connector"></div>

            <div className="lp-step">
              <div className="lp-step-number">02</div>
              <Heart size={26} className="lp-step-icon" />
              <h3 className="lp-step-title">Support a cause</h3>
              <p className="lp-step-desc">
                Every purchase directly funds a campaign or NGO of your choice.
                You decide where the impact goes.
              </p>
            </div>

            <div className="lp-step-connector"></div>

            <div className="lp-step">
              <div className="lp-step-number">03</div>
              <TrendingUp size={26} className="lp-step-icon" />
              <h3 className="lp-step-title">Track your impact</h3>
              <p className="lp-step-desc">
                Watch your contributions grow in real time. Earn ranks, badges,
                and rewards as you make a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURES */}
      <section className="lp-features">
        <div className="lp-container">
          <div className="lp-features-inner">
            <div className="lp-features-left">
              <p className="lp-eyebrow">Built for impact</p>
              <h2 className="lp-section-title">
                Everything you need to shop <em>smarter</em>
              </h2>
              <p className="lp-features-desc">
                From verified organisations to real-time impact tracking —
                Merch4Change puts purpose at the centre of every purchase.
              </p>
              <button
                className="lp-btn lp-btn-primary"
                onClick={() => navigate("/signup")}
              >
                Get started free
              </button>
            </div>

            <div className="lp-features-right">
              <div className="lp-feature-card">
                <div className="lp-feature-icon-wrap">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="lp-feature-title">Verified organisations only</h3>
                <p className="lp-feature-desc">
                  Every NGO and charity on Merch4Change is vetted. Shop knowing
                  your money goes exactly where it's meant to.
                </p>
              </div>

              <div className="lp-feature-card">
                <div className="lp-feature-icon-wrap">
                  <BarChart2 size={18} />
                </div>
                <h3 className="lp-feature-title">Real-time impact tracking</h3>
                <p className="lp-feature-desc">
                  Track donations, campaign progress, and your personal
                  contribution history — all in one clean dashboard.
                </p>
              </div>

              <div className="lp-feature-card">
                <div className="lp-feature-icon-wrap">
                  <Award size={18} />
                </div>
                <h3 className="lp-feature-title">Earn ranks and rewards</h3>
                <p className="lp-feature-desc">
                  The more you give, the more you earn. Unlock badges, exclusive
                  merch, and community recognition.
                </p>
              </div>

              <div className="lp-feature-card">
                <div className="lp-feature-icon-wrap">
                  <Users size={18} />
                </div>
                <h3 className="lp-feature-title">
                  Join a community of changemakers
                </h3>
                <p className="lp-feature-desc">
                  Follow organisations, connect with like-minded donors, and
                  celebrate impact together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — IMPACT STATS */}
      <section id="impact-stats" className="lp-stats">
        <div className="lp-container">
          <h2 className="lp-stats-headline">
            The numbers speak for <em>themselves</em>
          </h2>

          <div className="lp-stats-grid">
            <div className="lp-stat">
              <div className="lp-stat-number">2,400+</div>
              <div className="lp-stat-label">Active users</div>
            </div>
            <div className="lp-stat-divider"></div>

            <div className="lp-stat">
              <div className="lp-stat-number">$120K+</div>
              <div className="lp-stat-label">Donated to causes</div>
            </div>
            <div className="lp-stat-divider"></div>

            <div className="lp-stat">
              <div className="lp-stat-number">340+</div>
              <div className="lp-stat-label">Campaigns funded</div>
            </div>
            <div className="lp-stat-divider"></div>

            <div className="lp-stat">
              <div className="lp-stat-number">80+</div>
              <div className="lp-stat-label">Verified organisations</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — TESTIMONIALS */}
      <section className="lp-testimonials">
        <div className="lp-container">
          <div className="lp-section-header">
            <p className="lp-eyebrow">Community</p>
            <h2 className="lp-section-title">
              What our community <em>says</em>
            </h2>
          </div>

          <div className="lp-testimonials-grid">
            <div className="lp-testimonial-card">
              <p className="lp-testimonial-quote">
                I bought a tote bag and funded three meals for a local shelter.
                Never thought shopping could feel this meaningful.
              </p>
              <div className="lp-testimonial-author">
                <div className="lp-testimonial-avatar lp-avatar-1">AK</div>
                <div>
                  <div className="lp-testimonial-name">Anika K.</div>
                  <div className="lp-testimonial-role">Shopper, Colombo</div>
                </div>
              </div>
            </div>

            <div className="lp-testimonial-card">
              <p className="lp-testimonial-quote">
                Merch4Change helped us raise $12,000 in our first campaign. The
                platform is incredibly easy to set up and use.
              </p>
              <div className="lp-testimonial-author">
                <div className="lp-testimonial-avatar lp-avatar-2">SR</div>
                <div>
                  <div className="lp-testimonial-name">Sarah R.</div>
                  <div className="lp-testimonial-role">NGO Founder, Kandy</div>
                </div>
              </div>
            </div>

            <div className="lp-testimonial-card">
              <p className="lp-testimonial-quote">
                I follow three organisations and get notified every time a new
                campaign goes live. It's addictive in the best way.
              </p>
              <div className="lp-testimonial-author">
                <div className="lp-testimonial-avatar lp-avatar-3">DM</div>
                <div>
                  <div className="lp-testimonial-name">Dilan M.</div>
                  <div className="lp-testimonial-role">Donor, Galle</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FOR ORGANISATIONS CTA */}
      <section id="for-organisations" className="lp-org-cta">
        <div className="lp-container">
          <p className="lp-eyebrow lp-eyebrow-light">For organisations</p>
          <h2 className="lp-org-cta-headline">
            Ready to launch your <em>campaign?</em>
          </h2>
          <p className="lp-org-cta-subheading">
            Join hundreds of verified organisations already using Merch4Change
            to fund causes and build communities.
          </p>

          <div className="lp-org-cta-buttons">
            <button
              className="lp-btn lp-btn-org-primary"
              onClick={() => navigate("/signup")}
            >
              Create organisation account
            </button>
            <button
              className="lp-btn lp-btn-org-secondary"
              onClick={() => navigate("/about/story")}
            >
              Learn more
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL USER CTA */}
      <section className="lp-final-cta">
        <div className="lp-container">
          <h2 className="lp-final-headline">
            Start making a<br />
            <em>difference</em> today.
          </h2>
          <p className="lp-final-subheading">
            Sign up free. No credit card required. Start shopping for causes
            you care about in under 2 minutes.
          </p>

          <div className="lp-final-buttons">
            <button
              className="lp-btn lp-btn-primary"
              onClick={() => navigate("/signup")}
            >
              Create free account
            </button>
            <button
              className="lp-btn lp-btn-ghost"
              onClick={() => navigate("/marketplace")}
            >
              Browse marketplace
            </button>
          </div>

          <p className="lp-signin-prompt">
            Already have an account?{" "}
            <button
              className="lp-signin-link"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-columns">
            <div className="lp-footer-col-1">
              <div className="lp-footer-brand">
                <div className="lp-footer-icon">M</div>
                <span className="lp-footer-name">Merch4Change</span>
              </div>
              <p className="lp-footer-tagline">
                Shop with purpose. Give with heart.
              </p>
              <div className="lp-footer-socials">
                <a href="#" className="lp-footer-social" aria-label="Twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path
                      d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </a>
                <a href="#" className="lp-footer-social" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    ></rect>
                    <path
                      d="M12 16a4 4 0 100-8 4 4 0 000 8z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    ></path>
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1.5"
                      fill="currentColor"
                    ></circle>
                  </svg>
                </a>
                <a href="#" className="lp-footer-social" aria-label="LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path
                      d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    ></path>
                    <circle
                      cx="4"
                      cy="4"
                      r="2"
                      fill="currentColor"
                    ></circle>
                  </svg>
                </a>
              </div>
            </div>

            <div className="lp-footer-col">
              <h4 className="lp-footer-col-title">Platform</h4>
              <ul className="lp-footer-links">
                <li>
                  <button onClick={() => navigate("/marketplace")}>
                    Marketplace
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("how-it-works")}>
                    How it works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("for-organisations")}>
                    For Organisations
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("impact-stats")}>
                    Impact stories
                  </button>
                </li>
              </ul>
            </div>

            <div className="lp-footer-col">
              <h4 className="lp-footer-col-title">Company</h4>
              <ul className="lp-footer-links">
                <li>
                  <button onClick={() => navigate("/about/story")}>
                    About us
                  </button>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Press</a>
                </li>
              </ul>
            </div>

            <div className="lp-footer-col">
              <h4 className="lp-footer-col-title">Support</h4>
              <ul className="lp-footer-links">
                <li>
                  <button onClick={() => navigate("/help")}>
                    Help centre
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/help/contact")}>
                    Contact us
                  </button>
                </li>
                <li>
                  <a href="#">Privacy policy</a>
                </li>
                <li>
                  <a href="#">Terms of service</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <p>© 2026 Merch4Change. All rights reserved.</p>
            <p>Made with purpose in Sri Lanka 🇱🇰</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;

