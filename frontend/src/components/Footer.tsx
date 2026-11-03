import { Link } from 'react-router-dom';
import { Bike, MessageSquare, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse Brands', path: '/brands' },
    { label: 'Find Dealers', path: '/dealers' },
    { label: 'Book Trial', path: '/booking' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const popularBrands = [
    { label: 'Toyota', path: '/brands' },
    { label: 'Honda', path: '/brands' },
    { label: 'Royal Enfield', path: '/brands' },
    { label: 'Yamaha', path: '/brands' },
    { label: 'BMW', path: '/brands' },
    { label: 'Mahindra', path: '/brands' },
  ];

  return (
    <footer className="relative bg-[#09243b] border-t border-[#103a58]">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#103a58]/20 to-transparent pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center">
              <img src="/images/trial-your-dream-logo.svg" alt="Trial Your Dream" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-[#a9c3d0] text-sm leading-relaxed">
              Explore vehicle listings and request test drives through company-managed showrooms.
              This is a demonstration platform, not an official dealer network.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#f8fafc] font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-[#07549a] to-[#16a7b7] rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-[#a9c3d0] hover:text-[#07549a] transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3c6b85] group-hover:bg-[#07549a] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h3 className="text-[#f8fafc] font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-[#07549a] to-[#16a7b7] rounded-full" />
              Popular Brands
            </h3>
            <ul className="space-y-3">
              {popularBrands.map((brand) => (
                <li key={brand.label}>
                  <Link
                    to={brand.path}
                    className="text-[#a9c3d0] hover:text-[#07549a] transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <Bike className="w-4 h-4 text-[#3c6b85] group-hover:text-[#07549a] transition-colors" />
                    {brand.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#f8fafc] font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-[#07549a] to-[#16a7b7] rounded-full" />
              Contact Us
            </h3>
            <Link to="/contact" className="inline-flex items-center gap-2 text-sm text-[#a9c3d0] hover:text-white">
              <MessageSquare className="h-5 w-5 text-[#16a7b7]" />
              Send a platform support message
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#103a58] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#7695a5] text-sm text-center md:text-left">
            {new Date().getFullYear()} Trial Your Dream. All rights reserved. 
            Company-submitted listings are not independently verified.
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-[#07549a] to-[#06457c] text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;
