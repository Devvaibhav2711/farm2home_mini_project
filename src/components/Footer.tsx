import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-foreground rounded-full p-2">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">Farm2Home</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Bringing fresh farm produce directly to your doorstep. Quality guaranteed, farmers supported.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <NavLink to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Home
              </NavLink>
              <NavLink to="/products" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Products
              </NavLink>
              <NavLink to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                About Us
              </NavLink>
              <NavLink to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Contact
              </NavLink>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-primary-foreground/80">+91 8010246840</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-primary-foreground/80">vnimbalkar79@gmail.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span className="text-primary-foreground/80">
                  123 Farm Road, Green Valley, CA 12345
                </span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4">Delivery Hours</h3>
            <div className="text-sm text-primary-foreground/80">
              <p className="mb-2">Monday - Saturday</p>
              <p className="font-semibold">6:00 AM - 8:00 PM</p>
              <p className="mt-4">Sunday</p>
              <p className="font-semibold">8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} FreshFarm. All rights reserved. Fresh from farms to your home.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
