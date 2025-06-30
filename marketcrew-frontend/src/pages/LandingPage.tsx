import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Navbar />
      <header className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Elevate Your Marketing with AI-Powered Content
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-700">
          MarketCrew generates tailored content calendars, ad copy, visuals, and more—so your brand can focus on growth.
        </p>
        <button
          onClick={() => navigate("/app")}
          className="mt-8 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform shadow-lg"
        >
          Explore Demo
        </button>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        {[
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
        ].map(({ title, desc }) => (
          <div key={title} className="bg-white rounded-xl p-8 shadow-md border hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-indigo-600">{title}</h3>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-white py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Request Early Access</h2>
        <div className="max-w-xl mx-auto bg-gray-50 rounded-xl p-8 shadow-md">
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
                className="w-full px-5 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                rows={4}
                placeholder="Tell us about your needs…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-5 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
              >
                Request Access
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} MarketCrew. Crafted with ❤️ and AI.
      </footer>
    </div>
  );
};

export default LandingPage;
