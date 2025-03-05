
import React from "react";
import { Link } from "react-router-dom";
import { Users, Mail, Phone, MapPin, ExternalLink, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Alumni Connect</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting students and alumni to build lasting professional relationships and foster
              mentorship opportunities.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/profiles" className="hover:text-primary transition-colors">
                Profiles
              </Link>
              <Link to="/events" className="hover:text-primary transition-colors">
                Events
              </Link>
              <Link to="/login" className="hover:text-primary transition-colors">
                Login / Sign Up
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Resources</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <a href="#" className="hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Help Center
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>123 University Ave, Tech City</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:info@alumniconnect.edu" className="hover:text-primary transition-colors">
                  info@alumniconnect.edu
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  (123) 456-7890
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-8 border-t border-border text-sm">
          <p className="text-muted-foreground">
            © {currentYear} Alumni Connect. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <p className="text-muted-foreground flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-destructive" /> by Alumni Connect
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
