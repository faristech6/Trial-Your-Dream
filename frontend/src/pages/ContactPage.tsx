import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { apiFetch } from '../lib/api';
import { 
  MapPin,
  Mail,
  Phone,
  Send,
  Check,
  MessageSquare,
  User,
} from 'lucide-react';

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.fromTo(
      '.contact-content',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setSendError('');
    try {
      await apiFetch('/api/messages/platform', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (reason) {
      setSendError(reason instanceof Error ? reason.message : 'Could not send the message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: MessageSquare,
      title: 'Platform Support',
      details: ['Use this form to contact the Trial Your Dream team.'],
      color: 'blue',
    },
    {
      icon: MapPin,
      title: 'Showroom Locations',
      details: ['Find company-submitted locations on the Dealers page.'],
      color: 'blue',
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#09243b] pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-[#22c55e]" />
          </div>
          <h1 className="text-3xl font-bold text-[#f8fafc] mb-4">Message Sent!</h1>
          <p className="text-[#a9c3d0] mb-8">
            Thank you for reaching out. Your message was saved for platform support. Replies to signed-in customer inquiries can be viewed in My Messages. Response time is not guaranteed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#07549a] rounded-full text-white font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09243b] pt-20">
      {/* Header */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#103a58] to-[#09243b]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #07549a 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#07549a]/20 border border-[#07549a]/30 text-[#07549a] text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              Get in Touch
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold font-['Exo_2'] text-[#f8fafc] mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-[#a9c3d0]">
              Have questions about test rides or need assistance? We&apos;re here to help you 
              connect with the perfect vehicle.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="contact-content p-6 rounded-2xl bg-[#103a58] border border-[#285673]/50 hover:border-[#07549a]/50 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-${info.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <info.icon className={`w-7 h-7 text-${info.color}-500`} />
                </div>
                <h3 className="text-[#f8fafc] font-semibold text-lg mb-3">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-[#a9c3d0] text-sm">{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="contact-content">
              <h2 className="text-2xl font-bold text-[#f8fafc] mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {sendError && <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">{sendError}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#a9c3d0] mb-2">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7695a5]" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#103a58] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#07549a] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#a9c3d0] mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7695a5]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#103a58] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#07549a] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#a9c3d0] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7695a5]" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#103a58] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#07549a] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#a9c3d0] mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 rounded-xl bg-[#103a58] border border-[#285673] text-[#f8fafc] focus:outline-none focus:border-[#07549a] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select a subject</option>
                      <option value="test-ride">Book a Test Ride</option>
                      <option value="dealer">Dealer Inquiry</option>
                      <option value="vehicle">Vehicle Information</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a9c3d0] mb-2">
                    Your Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#7695a5]" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="How can we help you?"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#103a58] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#07549a] transition-colors resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#07549a] to-[#06457c] rounded-full text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Map & Social */}
            <div className="contact-content space-y-8">
              <div className="rounded-2xl border border-[#285673]/50 bg-[#103a58] p-7">
                <MapPin className="mb-4 h-10 w-10 text-[#16a7b7]" />
                <h3 className="text-xl font-semibold text-white">Find a Showroom</h3>
                <p className="mt-3 text-sm leading-6 text-[#a9c3d0]">
                  We do not publish an unverified headquarters address or telephone number.
                  Browse the company-managed showroom directory to find locations.
                </p>
                <Link to="/dealers" className="mt-5 inline-block rounded-xl bg-[#07549a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0875ac]">Browse Showrooms</Link>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-[#f8fafc] font-semibold mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Book Test Ride', path: '/booking' },
                    { label: 'Find Dealers', path: '/dealers' },
                    { label: 'Browse Brands', path: '/brands' },
                    { label: 'Vehicles', path: '/vehicles' },
                  ].map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="p-3 rounded-xl bg-[#103a58] border border-[#285673]/30 text-[#a9c3d0] text-sm hover:text-[#f8fafc] hover:border-[#07549a]/50 transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-[#103a58]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#f8fafc] mb-4">Frequently Asked Questions</h2>
            <p className="text-[#a9c3d0]">Find quick answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'How do I book a test ride?',
                a: 'Simply navigate to our booking page, select your preferred vehicle and dealer, choose a date and time, and submit your request.'
              },
              {
                q: 'Is there any cost for test rides?',
                a: 'No, all test rides booked through Trial Your Dream are completely free of charge.'
              },
              {
                q: 'What documents do I need?',
                a: 'You need a valid driving license and an ID proof (Aadhar/PAN/Passport) for test rides.'
              },
              {
                q: 'Can I test ride multiple vehicles?',
                a: 'Yes, you can book test rides for multiple vehicles to compare and find your perfect match.'
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#103a58] border border-[#285673]/50"
              >
                <h3 className="text-[#f8fafc] font-semibold mb-3">{faq.q}</h3>
                <p className="text-[#a9c3d0] text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
