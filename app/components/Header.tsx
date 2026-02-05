import { Link } from "react-router";
import { useState } from "react";

export function Header({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav>
            <div className="container">
                <div className="nav-container">
                    <Link to="/" className="logo" onClick={closeMenu}>
                        Giga<span>Flair</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="nav-links desktop-only">
                        <li><Link to="/#solutions" className="nav-link">Solutions</Link></li>
                        <li><Link to="/shifts" className="nav-link">Shifts</Link></li>
                        <li><Link to="/contact" className="nav-link">Contact</Link></li>
                        <li>
                            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                                {theme === "light" ? "🌙" : "☀️"}
                            </button>
                        </li>
                        <li className="nav-cta-item">
                            <Link to="/contact" className="btn-secondary nav-cta-btn">
                                Get Started
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Navigation Toggle */}
                    <div className="mobile-nav-controls">
                        <button onClick={toggleTheme} className="theme-toggle mobile-only" aria-label="Toggle Theme">
                            {theme === "light" ? "🌙" : "☀️"}
                        </button>
                        <button
                            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                            aria-label="Toggle Menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}>
                <div className="mobile-menu-content">
                    <ul className="mobile-nav-links">
                        <li><Link to="/" className="mobile-nav-link" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/#solutions" className="mobile-nav-link" onClick={closeMenu}>Solutions</Link></li>
                        <li><Link to="/shifts" className="mobile-nav-link" onClick={closeMenu}>Shifts</Link></li>
                        <li><Link to="/contact" className="mobile-nav-link" onClick={closeMenu}>Contact</Link></li>
                    </ul>
                    <div className="mobile-menu-footer">
                        <Link to="/contact" className="btn-primary" onClick={closeMenu} style={{ width: '100%', justifyContent: 'center' }}>
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
