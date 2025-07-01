import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/request-access`, { name, email, message });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send request. Please try again later.");
    }
  };

  const features = [
    {
      title: "Comprehensive Content",
      desc: "Weekly calendars, ad copy, visuals & more generated in minutes."
    },
    {
      title: "Custom-Tailored",
      desc: "Outputs are aligned to your brand voice, audience and goals."
    },
    {
      title: "Human + AI Excellence",
      desc: "Strategists refine AI output ensuring high-impact quality."
    }
  ];

  const milestones = [
    { text: "Launched with a single goal: to turn content chaos into clarity" },
    { text: "First users became evangelists, seeing results in weeks" },
    { text: "Partnered with freelancers, startups, and e-commerce brands" },
    { text: "Now powers content creation across industries" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Hero Section */}
      <header className="text-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
            Elevate Your Marketing with AI-Powered Content
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '8rem' }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 w-32 bg-gradient-to-r from-navy-primary to-rust mx-auto rounded-full mb-8"
          />
          <p className="text-lg md:text-xl text-navy-secondary/80 max-w-2xl mx-auto leading-relaxed mb-10">
            MarketCrew generates tailored content calendars, ad copy, visuals, and more—so your brand can focus on growth.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/app")}
            className="btn-primary px-8 py-4 text-lg font-semibold"
          >
            Explore Demo
          </motion.button>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ title, desc }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="card-premium p-8"
            >
              <h3 className="text-xl font-bold mb-3 text-navy-primary">{title}</h3>
              <p className="text-navy-secondary/80">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-navy-secondary mb-4">The Spark That Started It All</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-navy-primary to-rust mx-auto rounded-full mb-8" />
            <p className="text-lg text-navy-secondary/80 max-w-4xl mx-auto leading-relaxed">
              In a noisy world saturated with content, we saw too many great brands struggle—not because their ideas weren't powerful, but because they were buried under the weight of inconsistent messaging and chaotic content strategies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-navy-primary/5 p-8 rounded-2xl border border-navy-primary/10">
                <h3 className="text-2xl font-bold text-navy-primary mb-6">Our Mission</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-rust mr-3 mt-1">•</div>
                    <p className="text-navy-secondary/80">Democratize high-performance marketing</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-rust mr-3 mt-1">•</div>
                    <p className="text-navy-secondary/80">Harness AI to amplify creativity</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-rust mr-3 mt-1">•</div>
                    <p className="text-navy-secondary/80">Free up your time to focus on growth</p>
                  </li>
                </ul>
              </div>
              <div className="absolute -z-10 top-6 -left-6 w-full h-full rounded-2xl border-2 border-rust/20" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-navy-primary mb-6">Our Journey</h3>
              <div className="space-y-6">
                {milestones.map(({ text }, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 h-8 w-8 bg-navy-primary rounded-full flex items-center justify-center text-white mr-4 mt-1">
                      {index + 1}
                    </div>
                    <p className="text-navy-secondary/80">{text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-navy-primary/5 to-rust/5 p-8 rounded-2xl border border-navy-primary/10 text-center"
          >
            <h3 className="text-2xl font-bold text-navy-primary mb-4">Why We're Different</h3>
            <p className="text-navy-secondary/80 max-w-4xl mx-auto mb-6">
              Unlike generic AI tools, MarketCrew learns your brand and grows with you. We don't just generate content—we build momentum.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                "Tone-aligned content",
                "Structured campaigns",
                "Time-saving automation",
                "Brand consistency",
                "Strategic refinement",
                "Scalable solutions"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-lg shadow-sm border border-navy-primary/5"
                >
                  <p className="text-navy-secondary/80">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-navy-primary to-navy-secondary text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to elevate your marketing?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Let MarketCrew create while you lead. Try it today—and watch your brand thrive.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/app")}
            className="btn-secondary px-8 py-4 text-lg font-semibold"
          >
            Start Free – No Credit Card Required
          </motion.button>
        </motion.div>
      </section>

      {/* Early Access Form */}
      <section className="bg-white py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-navy-secondary">
            Request Early Access
          </h2>
          <div className="card-premium p-8">
            {submitted ? (
              <p className="text-center text-green-600 text-lg font-semibold">
                Thank you! We'll be in touch shortly.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input w-full"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input w-full"
                />
                <textarea
                  rows={4}
                  placeholder="Tell us about your needs..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-input w-full"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary w-full py-4 text-lg"
                >
                  Request Access
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="text-center py-12 text-navy-secondary/60 text-sm">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-navy-primary/30 to-transparent mx-auto mb-4" />
        <p>© {new Date().getFullYear()} MarketCrew. Crafted with ❤️ and AI.</p>
      </footer>
    </div>
  );
};

export default LandingPage;