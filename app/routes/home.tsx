import type { Route } from "./+types/home";
import { Link, useOutletContext } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "GigaFlair | Simple, Secure, Efficient Technology" },
    { name: "description", content: "We help organizations bridge the gap between human potential and technology through intelligent management and cost-saving security solutions." },
  ];
}

interface ContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Home() {
  const { theme, toggleTheme } = useOutletContext<ContextType>();

  return (
    <div className="home-wrapper">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <section className="hero">
        <div className="hero-glow"></div>
        <div className="container">
          <div className="hero-content animate-fade">
            <h1 className="gradient-text">Technology That Works for Humans</h1>
            <p>
              GigaFlair helps organizations simplify technology management, reduce licensing costs,
              and empower every individual to use the tools they need, securely and efficiently.
            </p>
            <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/shifts" className="btn-primary">
                Explore Shifts
              </Link>
              <Link to="/contact" className="btn-secondary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="section-padding" style={{ background: 'var(--brand-deep)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Simplified Operations. Real Savings.</h2>
            <p style={{ color: 'var(--text-secondary)' }}>We focus on making technology an asset, not a burden.</p>
          </div>

          <div className="features-grid">
            <div className="glass-card feature-card animate-fade">
              <div className="feature-icon">💰</div>
              <h3>Cost Optimization</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Identify and eliminate wasted license costs while ensuring your team has exactly what it needs to perform.
              </p>
            </div>

            <div className="glass-card feature-card animate-fade" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon">🛠️</div>
              <h3>Management Simplified</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Remove technical friction. We build systems that are easy to manage, so you can focus on your mission.
              </p>
            </div>

            <div className="glass-card feature-card animate-fade" style={{ animationDelay: '0.4s' }}>
              <div className="feature-icon">🔒</div>
              <h3>Practical Security</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Protect your organization by empowering humans to navigate work securely with the technology they need.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="glass-card" style={{ padding: '4rem', display: 'flex', alignItems: 'center', gap: '4rem', overflow: 'hidden' }}>
            <div style={{ flex: 1 }}>
              <span style={{ color: 'var(--brand-primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' }}>Flagship Product</span>
              <h2 style={{ fontSize: '3rem', margin: '1rem 0' }}>GigaFlair Shifts</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                The intuitive volunteer, seasonal, and deskless staff management platform designed to help
                organizations save money and reduce hours of unnecessary administrative work.
              </p>
              <Link to="/shifts" className="btn-primary">
                Learn More about Shifts
              </Link>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <img
                src="/admin-schedule-v2.png"
                alt="GigaFlair Shifts Schedule Dashboard"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
                  border: '1px solid var(--glass-border)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
