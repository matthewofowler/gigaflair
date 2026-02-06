import type { Route } from "./+types/shifts";
import { Link, useOutletContext } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Shifts | Staffing Reimagined" },
        { name: "description", content: "The intuitive volunteer, seasonal, and deskless staff management platform." },
    ];
}

interface ContextType {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

export default function ShiftsPage() {
    const { theme, toggleTheme } = useOutletContext<ContextType>();

    return (
        <div className="product-wrapper">
            <Header theme={theme} toggleTheme={toggleTheme} />

            <section className="hero" style={{ minHeight: '80vh' }}>
                <div className="hero-glow"></div>
                <div className="container">
                    <div className="hero-content animate-fade">
                        <span style={{ color: 'var(--brand-accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>Staffing Reimagined</span>
                        <h1 className="gradient-text" style={{ fontSize: 'clamp(3rem, 7vw, 4rem)', marginTop: '1rem' }}>GigaFlair Shifts</h1>
                        <p>
                            The intuitive volunteer, seasonal, and deskless staff management platform designed to help
                            organizations save money and reduce hours of unnecessary administrative work.
                        </p>
                        <p style={{ marginTop: '-1.5rem', marginBottom: '3rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                            Recycle your old paper training binders and get GigaFlair Shifts.
                        </p>
                        <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Link to="/contact" className="btn-primary">
                                Learn More
                            </Link>
                            <Link to="#features" className="btn-secondary">
                                Explore Features
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="section-padding">
                <div className="container">
                    <div style={{ marginBottom: '6rem' }}>

                        {/* Feature 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', marginBottom: '6rem', flexDirection: 'row' }}>
                            <div style={{ flex: 1 }}>
                                <img src="/admin-schedule.png" alt="Admin Schedule Dashboard" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Next-Gen Scheduling</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                    Effortlessly manage shifts with our real-time dashboard. The integrated 'Pending Requests' sidebar allows admins to quickly approve or deny shift trades and drops, keeping your schedule fluid and updated.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', marginBottom: '6rem', flexDirection: 'row-reverse' }}>
                            <div style={{ flex: 1 }}>
                                <img src="/admin-alerts.png" alt="Communications Hub" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Instant Communications</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                    Reach your entire team instantly via Shifts notifications and Email. The Communications Hub gives admins a single place to compose urgent alerts or pin essential announcements to worker dashboards.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', marginBottom: '6rem', flexDirection: 'row' }}>
                            <div style={{ flex: 1 }}>
                                <img src="/shifts-login.png" alt="Worker Access Screen" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Frictionless Access</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                    No passwords to forget. Secure "Magic Link" login makes it incredibly easy for seasonal, volunteer, and deskless staff to access their schedules and training materials immediately.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4: Worker Experience */}
                        <div style={{ padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Empower Your Workforce</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>A seamless experience designed for the people doing the work.</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <img src="/worker-alerts.png" alt="Worker Alerts" style={{ width: '100%', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }} />
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Stay Informed</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>Workers get a clear, prioritized view of communications from management, ensuring important safety info and schedule changes are never missed.</p>
                                </div>
                                <div>
                                    <img src="/worker-documents.png" alt="Worker Documents" style={{ width: '100%', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }} />
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>On-the-Go Training</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>Digitize your training binders. The Documents Hub provides staff with instant access to policies, handbooks, and training materials from any device.</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="features-grid">
                        <div className="glass-card feature-card animate-fade">
                            <div className="feature-icon">📅</div>
                            <h3>Intelligent Scheduling</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                                Automate your shift management. Reduce errors and ensure your team is always where they need to be.
                            </p>
                        </div>

                        <div className="glass-card feature-card animate-fade" style={{ animationDelay: '0.1s' }}>
                            <div className="feature-icon">📱</div>
                            <h3>Simple Alerts</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                                Instant notifications that actually work. Keep everyone in the loop without the complexity.
                            </p>
                        </div>

                        <div className="glass-card feature-card animate-fade" style={{ animationDelay: '0.2s' }}>
                            <div className="feature-icon">📁</div>
                            <h3>Secure Compliance</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                                Track policy acknowledgements and store essential documents in one secure, easy-to-manage location.
                            </p>
                        </div>

                        <div className="glass-card feature-card animate-fade" style={{ animationDelay: '0.3s' }}>
                            <div className="feature-icon">💹</div>
                            <h3>Cost Control</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                                Gain visibility into your staffing costs and licensing requirements to maximize your budget.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div >
    );
}
