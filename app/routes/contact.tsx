import type { Route } from "./+types/contact";
import { Link, useOutletContext, Form, useActionData, useNavigation } from "react-router";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Contact GigaFlair | Let's Connect" },
        { name: "description", content: "Get in touch with the GigaFlair team. We're here to help you simplify your organizational technology." },
    ];
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // SIMULATION: In a real app, you would use Resend/Mailgun/etc here.
    // Example: await resend.emails.send({ from: 'GigaFlair <info@gigaflair.com>', to: 'info@gigaflair.com', ... });

    console.log("Contact Form Submission:", { name, email, message });

    // Simulate a small delay for the "Sending" state
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
}

interface ContextType {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

export default function Contact() {
    const { theme, toggleTheme } = useOutletContext<ContextType>();
    const actionData = useActionData() as { success: boolean } | undefined;
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (actionData?.success) {
            setShowSuccess(true);
        }
    }, [actionData]);

    return (
        <div className="contact-wrapper">
            <nav>
                <div className="container">
                    <div className="nav-container">
                        <Link to="/" className="logo">
                            GIGA<span>FLAIR</span>
                        </Link>
                        <ul className="nav-links">
                            <li><Link to="/" className="nav-link">Home</Link></li>
                            <li><Link to="/rosterflair" className="nav-link">RosterFlair</Link></li>
                            <li>
                                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                                    {theme === "light" ? "🌙" : "☀️"}
                                </button>
                            </li>
                            <li><Link to="/contact" className="btn-primary" style={{ padding: '0.4rem 1.2rem', borderRadius: '50px', fontSize: '0.8rem' }}>Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <section className="hero" style={{ minHeight: '60vh', paddingBottom: '2rem' }}>
                <div className="hero-glow"></div>
                <div className="container">
                    <div className="hero-content animate-fade">
                        <h1 className="gradient-text">Let's Connect</h1>
                        <p>
                            Questions? Drop us a message
                            and we'll get back to you as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section-padding" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="glass-card" style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        {showSuccess ? (
                            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ fontSize: '4rem' }}>⭐</div>
                                <h2 style={{ fontSize: '2rem' }}>Message Received!</h2>
                                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                                    Thank you for reaching out. We've received your inquiry and our team will get back to you shortly at <strong>info@gigaflair.com</strong>.
                                </p>
                                <button
                                    onClick={() => setShowSuccess(false)}
                                    className="btn-secondary"
                                    style={{ marginTop: '1rem' }}
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <Form method="post" className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" name="name" className="form-control" placeholder="Your Name" required disabled={isSubmitting} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" className="form-control" placeholder="your@email.com" required disabled={isSubmitting} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" className="form-control" placeholder="How can we help?" required disabled={isSubmitting}></textarea>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{ width: '100%', justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </button>
                                    <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Or email us directly at <a href="mailto:info@gigaflair.com" style={{ color: 'var(--brand-primary)', textDecoration: 'none' }}>info@gigaflair.com</a>
                                    </p>
                                </div>
                            </Form>
                        )}
                    </div>
                </div>
            </section>

            <footer className="section-padding">
                <div className="container">
                    <div style={{ textAlign: 'center' }}>
                        <Link to="/" className="logo" style={{ marginBottom: '1.5rem', justifyContent: 'center' }}>GIGA<span>FLAIR</span></Link>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Built for humans, by GigaFlair.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
