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

export async function action({ request, context }: Route.ActionArgs) {
    const formData = await request.formData();
    const company = formData.get("company") as string;
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const description = formData.get("description") as string;
    const honeypot = formData.get("website_verification") as string;

    // Honeypot check
    if (honeypot) {
        console.log("Spam detected via honeypot field.");
        return { success: true }; // Silently "succeed" to confuse bots
    }

    // Access environment variable from Cloudflare context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (context as any).cloudflare.env as {
        ZEPTOMAIL_API_KEY: string;
        ZOHO_CRM_PUBLIC_ID?: string;
        ZOHO_CRM_HIDDEN_KEY?: string;
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

    if (!env.ZEPTOMAIL_API_KEY) {
        console.error("Missing ZEPTOMAIL_API_KEY");
        return { success: true, warning: "Missing API Key" };
    }

    const escapeHtml = (unsafe: string) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // 1. Send Email via ZeptoMail
    try {
        const response = await fetch("https://api.zeptomail.com/v1.1/email", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": env.ZEPTOMAIL_API_KEY
            },
            body: JSON.stringify({
                "from": { "address": "noreply@mail.gigaflair.com", "name": "GigaFlair Contact Form" },
                "to": [{ "email_address": { "address": "info@gigaflair.com", "name": "GigaFlair Info" } }],
                "reply_to": [{ "address": email, "name": `${firstName} ${lastName}` }],
                "subject": `New Contact: ${firstName} ${lastName}`,
                "htmlbody": `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Company:</strong> ${escapeHtml(company || "N/A")}</p>
                    <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Description:</strong></p>
                    <p>${escapeHtml(description).replace(/\n/g, '<br/>')}</p>
                `
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ZeptoMail Error:", errorText);
            // Don't fail the user if email fails, but log it.
        }
    } catch (e) {
        console.error("Email submission error:", e);
    }

    // 2. Submit to Zoho CRM (Web-to-Lead) - Placeholder until keys provided
    if (env.ZOHO_CRM_PUBLIC_ID && env.ZOHO_CRM_HIDDEN_KEY) {
        try {
            const crmFormData = new FormData();
            crmFormData.append("xnQsjsdp", env.ZOHO_CRM_PUBLIC_ID);
            crmFormData.append("xmIwtLD", env.ZOHO_CRM_HIDDEN_KEY);
            crmFormData.append("actionType", "TGVhZHM=");
            crmFormData.append("Company", company);
            crmFormData.append("First Name", firstName);
            crmFormData.append("Last Name", lastName);
            crmFormData.append("Email", email);
            crmFormData.append("Description", description);
            // crmFormData.append("Lead Source", "GigaFlair Contact Page"); // Re-enable if allowed by Zoho config

            // Note: Zoho Web-to-Lead expects a form POST, typically from a browser.
            // Doing it server-side requires mimicry or using the Insert Records API (which needs OAuth).
            // For now, we will assume standard POST works or we might need to route the user
            // to a success page that submits this invisibly if CORS blocks us.
            // Given we are on Cloudflare Workers, a direct POST to the CRM URL might not behave
            // exactly like a browser form submit (no redirects), but let's try.
            await fetch("https://crm.zoho.com/crm/WebToLeadForm", {
                method: "POST",
                body: crmFormData
            });
        } catch (e) {
            console.error("CRM submission error", e);
        }
    }

    return { success: true };
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
                    <div className="glass-card" style={{ padding: '3rem', maxWidth: '700px', margin: '0 auto' }}>
                        {showSuccess ? (
                            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem' }}>⭐</div>
                                <h2 style={{ fontSize: '2rem' }}>Message Received!</h2>
                                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                                    Thank you for reaching out. We've received your inquiry and our team will get back to you shortly.
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
                            <Form method="post" className="contact-form" style={{ marginTop: 0 }}>
                                {/* Honeypot field - hidden from humans */}
                                <div className="hidden-field" aria-hidden="true">
                                    <label htmlFor="website_verification">Leave this field blank</label>
                                    <input
                                        type="text"
                                        id="website_verification"
                                        name="website_verification"
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="company">Company</label>
                                    <input type="text" id="company" name="company" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="first_name">First Name<span style={{ color: 'var(--brand-primary)', marginLeft: '2px' }}>*</span></label>
                                    <input type="text" id="first_name" name="first_name" className="form-control" required disabled={isSubmitting} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="last_name">Last Name<span style={{ color: 'var(--brand-primary)', marginLeft: '2px' }}>*</span></label>
                                    <input type="text" id="last_name" name="last_name" className="form-control" required disabled={isSubmitting} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email<span style={{ color: 'var(--brand-primary)', marginLeft: '2px' }}>*</span></label>
                                    <input type="email" id="email" name="email" className="form-control" required disabled={isSubmitting} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description<span style={{ color: 'var(--brand-primary)', marginLeft: '2px' }}>*</span></label>
                                    <textarea id="description" name="description" className="form-control" required disabled={isSubmitting}></textarea>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        style={{ flex: 1, justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Sending..." : "Submit"}
                                    </button>
                                    <button type="reset" className="btn-secondary" disabled={isSubmitting}>
                                        Reset
                                    </button>
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
