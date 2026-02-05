import type { Route } from "./+types/contact";
import { Link, useOutletContext, Form, useActionData, useNavigation } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Contact GigaFlair | Let's Connect" },
        { name: "description", content: "Get in touch with the GigaFlair team. We're here to help you simplify your organizational technology." },
    ];
}

import { Resend } from "resend";

export async function action({ request, context }: Route.ActionArgs) {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Access environment variable from Cloudflare context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (context as any).cloudflare.env as {
        RESEND_API_KEY: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        RATE_LIMITS: any;
    };

    // Rate Limiting
    const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1";

    if (env.RATE_LIMITS) {
        const limitKey = `contact_limit:${ip}`;
        const currentCount = await env.RATE_LIMITS.get(limitKey);
        const count = currentCount ? parseInt(currentCount) : 0;

        if (count >= 10) {
            return { success: false, error: "Too many requests. Please try again in an hour." };
        }

        await env.RATE_LIMITS.put(limitKey, (count + 1).toString(), { expirationTtl: 3600 });
    }

    if (!env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY");
        return { success: true, warning: "Missing API Key" };
    }

    const resend = new Resend(env.RESEND_API_KEY);

    const escapeHtml = (unsafe: string) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    try {
        const { data, error } = await resend.emails.send({
            from: 'GigaFlair Contact Form <noreply@gigaflair.com>',
            to: ['info@gigaflair.com'],
            replyTo: email,
            subject: `New Message from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
            `
        });

        if (error) {
            console.error("Resend Error:", error);
            // Return success: false to handle error UI if we wanted
            return { success: false, error: `Resend Error: ${error.message} - ${error.name}` };
        }

        return { success: true };
    } catch (e) {
        console.error("Submission error:", e);
        return { success: false, error: "Unexpected error" };
    }
}

interface ContextType {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

export default function Contact() {
    const { theme, toggleTheme } = useOutletContext<ContextType>();
    const actionData = useActionData() as { success: boolean; error?: string; warning?: string } | undefined;
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
            <Header theme={theme} toggleTheme={toggleTheme} />

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
                        {actionData && !actionData.success && (
                            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 0, 0, 0.1)', border: '1px solid rgba(255, 0, 0, 0.2)', borderRadius: '8px', color: '#ff6b6b', fontSize: '0.9rem' }}>
                                <strong>Error:</strong> {actionData.error || "Something went wrong."}
                            </div>
                        )}
                        {actionData && actionData.warning && (
                            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 165, 0, 0.1)', border: '1px solid rgba(255, 165, 0, 0.2)', borderRadius: '8px', color: '#ffb142', fontSize: '0.9rem' }}>
                                <strong>Warning:</strong> {actionData.warning}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
