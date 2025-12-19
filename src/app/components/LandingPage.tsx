import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, ArrowRight, Home, Lightbulb, BadgeDollarSign, Facebook, Twitter, Linkedin, Instagram, Image as ImageIcon } from 'lucide-react';

export function LandingPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [contactForm, setContactForm] = useState({ fullName: '', email: '', mobile: '', city: '' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const p = await api.getProjects();
      setProjects(p || []);
      const c = await api.getClients();
      setClients(c || []);
    } catch (e) {
      console.error("Failed to load data", e);
      toast.error("Could not load projects or clients. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitContact(contactForm);
      toast.success("Message sent successfully!");
      setContactForm({ fullName: '', email: '', mobile: '', city: '' });
    } catch (e) {
      toast.error("Failed to send message");
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.subscribeNewsletter(newsletterEmail);
      toast.success("Subscribed to newsletter!");
      setNewsletterEmail('');
    } catch (e) {
      toast.error("Failed to subscribe");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      
      {/* Navbar */}
      <nav className="bg-white py-5 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-blue-600 p-1 rounded-sm">
               <Home className="text-white w-5 h-5" />
             </div>
             <span className="text-xl font-bold text-gray-800">Real Trust</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-xs font-bold uppercase tracking-wider text-blue-600">Home</a>
            <a href="#services" className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-blue-600 transition-colors">Services</a>
            <a href="#projects" className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-blue-600 transition-colors">Our Projects</a>
            <a href="#testimonials" className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-blue-600 transition-colors">Testimonials</a>
          </div>

          <div className="flex gap-4">
             <Link to="/admin" className="hidden md:block">
                 <Button variant="ghost" className="text-xs font-bold uppercase">Admin</Button>
             </Link>
             <a href="#contact">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-none px-6 py-2 text-xs font-bold uppercase tracking-wider">
                  Contact
                </Button>
             </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[650px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1565011447367-85026d8b3880?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3RzJTIwbG9va2luZyUyMGF0JTIwYmx1ZXByaW50c3xlbnwxfHx8fDE3NjYxMzcwMDR8MA&ixlib=rb-4.1.0&q=80&w=1920" 
            alt="Consultation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Consultation,<br />
              Design,<br />
              & Marketing
            </h1>
          </div>

          {/* Floating Form */}
          <div className="hidden md:block w-[380px] bg-blue-900/60 backdrop-blur-md border border-white/20 p-8 shadow-2xl">
             <h3 className="text-2xl font-bold text-white mb-2">Get a Free</h3>
             <h3 className="text-2xl font-bold text-white mb-6">Consultation</h3>
             
             <form onSubmit={handleContactSubmit} className="space-y-4">
               <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 py-3 focus:outline-none focus:border-white transition-colors"
                  value={contactForm.fullName}
                  onChange={(e) => setContactForm({...contactForm, fullName: e.target.value})}
                  required
               />
               <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 py-3 focus:outline-none focus:border-white transition-colors"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
               />
               <input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 py-3 focus:outline-none focus:border-white transition-colors"
                  value={contactForm.mobile}
                  onChange={(e) => setContactForm({...contactForm, mobile: e.target.value})}
                  required
               />
               <input 
                  type="text" 
                  placeholder="Area / City" 
                  className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/70 py-3 focus:outline-none focus:border-white transition-colors"
                  value={contactForm.city}
                  onChange={(e) => setContactForm({...contactForm, city: e.target.value})}
                  required
               />
               
               <Button type="submit" className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase py-6 rounded-none">
                 Get Quick Quote
               </Button>
             </form>
          </div>
        </div>
      </header>

      {/* Mobile Form (visible only on mobile) */}
      <div id="contact" className="md:hidden bg-blue-900 p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Get a Free Consultation</h3>
        <form onSubmit={handleContactSubmit} className="space-y-4">
           <Input 
              placeholder="Full Name" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={contactForm.fullName}
              onChange={(e) => setContactForm({...contactForm, fullName: e.target.value})}
           />
           <Input 
              placeholder="Email" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={contactForm.email}
              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
           />
           <Input 
              placeholder="Mobile" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={contactForm.mobile}
              onChange={(e) => setContactForm({...contactForm, mobile: e.target.value})}
           />
           <Input 
              placeholder="City" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={contactForm.city}
              onChange={(e) => setContactForm({...contactForm, city: e.target.value})}
           />
           <Button className="w-full bg-orange-500 hover:bg-orange-600">Get Quick Quote</Button>
        </form>
      </div>

      {/* Not Your Average Realtor Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-blue-600 mb-6">Not Your Average Realtor</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Real Trust has an eye for real estate properties tailored to client selling design. We use effective marketing to get buyers for any updates in the market.
            </p>
            <p className="text-gray-500 leading-relaxed">
              We provide comprehensive services including consultation, design advice, and strategic marketing to ensure your property stands out.
            </p>
          </div>

          <div className="relative h-[500px] w-full hidden md:block">
            {/* Background decorative circle path - SVG */}
            <svg className="absolute top-0 right-0 w-full h-full pointer-events-none z-0" viewBox="0 0 500 500">
               <path d="M 50 250 A 200 200 0 0 1 450 250" fill="none" stroke="#E5E7EB" strokeWidth="1" />
               <circle cx="450" cy="250" r="10" className="fill-blue-600" />
               <circle cx="250" cy="450" r="10" className="fill-orange-500" />
            </svg>

            {/* Images */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
               <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-xl">
                 <img src="https://images.unsplash.com/photo-1758599543230-652cc6831d69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBzdWl0JTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjEzNzAwNHww&ixlib=rb-4.1.0&q=80&w=500" className="w-full h-full object-cover" />
               </div>
            </div>

            <div className="absolute top-0 right-10 z-10">
               <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                 <img src="https://images.unsplash.com/photo-1760543998147-117ae5649c5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwc3VpdCUyMHNtaWxpbmd8ZW58MXx8fHwxNzY2MTM3MDA0fDA&ixlib=rb-4.1.0&q=80&w=400" className="w-full h-full object-cover" />
               </div>
            </div>

            <div className="absolute bottom-10 right-20 z-10">
               <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                 <img src="https://images.unsplash.com/photo-1558203728-00f45181dd84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwcmVhbCUyMGVzdGF0ZSUyMGFnZW50JTIwbWFufGVufDF8fHx8MTc2NjEzNzAxMHww&ixlib=rb-4.1.0&q=80&w=400" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-16">Why Choose Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                <Home className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-3">Potential ROI</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Whether you are looking to buy a home or sell, we calculate potential ROI to ensure you get the best deal.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-3">Design</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                 Our strategies include interior design tweaks that push your property above others in the marketplace.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                <BadgeDollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-3">Marketing</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Using social media, professional photos and sophisticated digital marketing campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 relative overflow-hidden bg-white">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Images Row */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-16 relative">
             
             {/* Left Image - Shaking Hands */}
             <div className="relative z-10 w-64 h-64 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1752159684779-0639174cdfac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0d28lMjBtZW4lMjBzaGFraW5nJTIwaGFuZHMlMjBvdXRzaWRlJTIwc3VpdHxlbnwxfHx8fDE3NjYxMzc2MzV8MA&ixlib=rb-4.1.0&q=80&w=400" 
                  alt="Partnership" 
                  className="w-full h-full object-cover shadow-lg" 
                />
                {/* Orange L bottom-left */}
                <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-orange-500"></div>
             </div>

             {/* Center Image - Interior Discussion - Larger */}
             <div className="relative z-20 w-80 h-80 shrink-0 -my-8 md:my-0 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1758523416144-d100288c5451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnQlMjBzaG93aW5nJTIwaG91c2UlMjBpbnRlcmlvciUyMHRvJTIwY291cGxlfGVufDF8fHx8MTc2NjEzNzYzNXww&ixlib=rb-4.1.0&q=80&w=600" 
                  alt="Interior Design" 
                  className="w-full h-full object-cover" 
                />
                {/* Blue Square Top Left */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500"></div>
                {/* Blue Corner Top Right */}
                <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-blue-500"></div>
             </div>

             {/* Right Image - Meeting */}
             <div className="relative z-10 w-64 h-64 shrink-0">
                <img 
                   src="https://images.unsplash.com/photo-1739289671673-b844b15dcfa5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWV0aW5nJTIwb2ZmaWNlJTIwcGVvcGxlJTIwc21pbGluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NjYxMzc2MzV8MA&ixlib=rb-4.1.0&q=80&w=400" 
                   alt="Meeting" 
                   className="w-full h-full object-cover shadow-lg" 
                />
                {/* Orange Corner Bottom Right */}
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-orange-500"></div>
             </div>
          </div>

          {/* Text Content */}
          <div className="text-center max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold text-blue-600 mb-4">About Us</h2>
             <div className="w-16 h-1 bg-blue-600 mx-auto mb-8 rounded-full"></div>
             
             <p className="text-gray-500 mb-10 leading-relaxed">
               Fifteen years of experience in real estate, excellent customer service and a commitment to work hard, listen and follow through. We provide quality service to build relationships with clients and, more importantly, maintain those relationships by communicating effectively.
             </p>
             
             <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white uppercase font-bold px-8 py-2 rounded-full text-xs transition-colors">
               Learn More
             </Button>
          </div>
        </div>
      </section>

      {/* Our Projects */}
      <section id="projects" className="py-24 px-6 max-w-[1400px] mx-auto bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-600 mb-6">Our Projects</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            We know what buyers are looking for and suggest projects that will bring clients top dollar for the sale of their homes.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border border-gray-100 max-w-lg mx-auto text-center px-4">
             <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
               <Home className="w-10 h-10 text-blue-200" />
             </div>
             <h3 className="text-xl font-bold text-gray-600 mb-2">No Projects Yet</h3>
             <p className="text-gray-400 mb-6 text-sm">
               Projects added in the Admin Panel will appear here.
             </p>
             <Link to="/admin">
               <Button className="bg-blue-600 hover:bg-blue-700">Add Project</Button>
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                 {/* Image Container */}
                 <div className="h-48 overflow-hidden relative bg-gray-100">
                   {project.imageUrl ? (
                     <img 
                        src={project.imageUrl} 
                        alt={project.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                     />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                       <ImageIcon className="w-12 h-12 opacity-50" />
                     </div>
                   )}
                 </div>
                 
                 {/* Content */}
                 <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-blue-500 font-bold text-lg mb-2">{project.name}</h3>
                    <p className="text-gray-400 text-xs uppercase mb-4 tracking-wide font-medium">
                      {project.description ? project.description.substring(0, 25) + (project.description.length > 25 ? "..." : "") : "Project Name | Location"}
                    </p>
                    
                    <div className="mt-auto">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white uppercase text-[10px] font-bold tracking-widest py-2 h-auto rounded shadow-md hover:shadow-lg transition-all">
                        Read More
                      </Button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Happy Clients */}
      <section id="testimonials" className="py-24 px-6 bg-blue-50/30 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500 rounded-full opacity-20"></div>
           <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-100 rounded-full opacity-20 filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-blue-600 mb-16">Happy Clients</h2>

          {loading ? (
             <div className="text-center text-gray-400">Loading testimonials...</div>
          ) : clients.length === 0 ? (
            <div className="text-center text-gray-400 bg-white/50 p-8 rounded-lg">
              <p className="mb-4">No testimonials yet.</p>
              <Link to="/admin">
                 <Button variant="link" className="text-blue-600">Add Clients in Admin</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clients.map((client) => (
                <Card key={client.id} className="border-none shadow-md bg-white p-8">
                   <div className="flex flex-col items-start text-left h-full">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-6 bg-gray-200 shrink-0">
                        {client.imageUrl ? (
                           <img src={client.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full bg-gray-300"></div>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm italic mb-6 flex-1">
                        "{client.description}"
                      </p>
                      <div>
                        <h4 className="text-blue-600 font-bold">{client.name}</h4>
                        <p className="text-gray-400 text-xs">{client.designation}</p>
                      </div>
                   </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-[400px] flex items-center justify-center text-center px-4">
         <img 
            src="https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY2MDc4MDAxfDA&ixlib=rb-4.1.0&q=80&w=1920" 
            className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-black/60"></div>
         
         <div className="relative z-10 max-w-3xl">
           <h2 className="text-3xl font-bold text-white mb-8 leading-snug">
             Learn more about our listing process, as well as our additional staging and design work.
           </h2>
           <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold uppercase px-8 py-3 text-sm rounded-none">
             Learn More
           </Button>
         </div>
      </section>

      {/* Footer */}
      <footer>
        {/* Blue Top Footer */}
        <div className="bg-blue-500 text-white py-12 px-6">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex gap-8 text-sm font-bold uppercase tracking-wide">
                 <a href="#" className="hover:text-blue-100">Home</a>
                 <a href="#" className="hover:text-blue-100">Services</a>
                 <a href="#" className="hover:text-blue-100">Projects</a>
                 <a href="#" className="hover:text-blue-100">Testimonials</a>
                 <a href="#" className="hover:text-blue-100">Contact</a>
              </div>

              <div className="flex w-full md:w-auto">
                 <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-[400px]">
                    <input 
                      type="email" 
                      placeholder="Enter Email Address"
                      className="flex-1 bg-blue-400/50 border border-blue-300 text-white placeholder-blue-200 px-4 py-3 focus:outline-none"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <Button type="submit" className="bg-white text-blue-600 hover:bg-gray-100 rounded-none px-6 py-3 font-bold uppercase text-xs">
                      Subscribe
                    </Button>
                 </form>
              </div>
           </div>
        </div>

        {/* Dark Bottom Footer */}
        <div className="bg-gray-900 text-gray-400 py-6 px-6">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs">All Rights Reserved 2025</p>
              
              <div className="flex items-center gap-2">
                 <Home className="w-4 h-4 text-white" />
                 <span className="text-white font-bold text-sm">Real Trust</span>
              </div>

              <div className="flex gap-4">
                 <Twitter className="w-4 h-4 hover:text-white cursor-pointer" />
                 <Facebook className="w-4 h-4 hover:text-white cursor-pointer" />
                 <Instagram className="w-4 h-4 hover:text-white cursor-pointer" />
                 <Linkedin className="w-4 h-4 hover:text-white cursor-pointer" />
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
