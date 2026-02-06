import { Link } from "react-router";

export function Footer() {
    return (
        <footer className="section-padding">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Link to="/" className="logo" style={{ marginBottom: '1.5rem' }}>Giga<span>Flair</span></Link>
                        <p className="footer-description">
                            Empowering organizations through simplified technology and management solutions.
                        </p>
                    </div>
                    <div className="footer-links-container">
                        <div className="footer-group">
                            <h4>Solutions</h4>
                            <ul className="footer-links">
                                <li><Link to="/shifts">Shifts</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    © {new Date().getFullYear()} GigaFlair LLC. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
