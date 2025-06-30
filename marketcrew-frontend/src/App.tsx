import { useState, useEffect } from "react";
import axios from "axios";
import Auth from "./Auth";
import Home from "./Home"; // Import the Home component

const BACKEND_URL = "http://localhost:8000"; // Change for production

type FormData = {
  brand_name: string;
  industry: string;
  audience: string;
  tone: string;
  goals: string;
  products: string[];
};

type GeneratedContent = {
  weekly_posts: string;
  cleaned_posts: string;
  ad_copies: string;
  visual_briefs: string;
  hashtags: string;
  platform_split: string;
  whatsapp_broadcast: string;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'app'>('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login'); // To control Auth component mode

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
      setCurrentView('app');
    }
  }, []);

  const handleLoginSuccess = (userProfile: FormData) => {
    setIsLoggedIn(true);
    setCurrentView('app');
    setFormData(userProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setCurrentView('home');
    // Reset form data and generated content on logout
    setFormData({
      brand_name: "",
      industry: "",
      audience: "",
      tone: "friendly",
      goals: "",
      products: [],
    });
    setLoading(false);
    setShowOptions(false);
    setGeneratedContent("");
    setAllGeneratedContent(null);
    setEmail("");
  };

  const handleShowLogin = () => {
    setAuthMode('login');
    setCurrentView('auth');
  };

  const handleShowSignup = () => {
    setAuthMode('signup');
    setCurrentView('auth');
  };

  const [formData, setFormData] = useState<FormData>({
    brand_name: "",
    industry: "",
    audience: "",
    tone: "friendly",
    goals: "",
    products: [],
  });

  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [allGeneratedContent, setAllGeneratedContent] = useState<GeneratedContent | null>(null);
  const [email, setEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "products") {
      setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()).filter(item => item) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      console.log('Token from localStorage before /generate request:', token);
      const response = await axios.post(`${BACKEND_URL}/generate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllGeneratedContent(response.data.content);
      setGeneratedContent(response.data.content.weekly_posts);
      setShowOptions(true);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Check console for details. (Rate limit or other API error)");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (allGeneratedContent) {
      window.open(`${BACKEND_URL}/deliver/download?brand_name=${formData.brand_name}`, "_blank");
    }
  };

  const handleSendToNotion = async () => {
    if (allGeneratedContent) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(`${BACKEND_URL}/deliver/notion`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert(response.data.message);
      } catch (error) {
        console.error(error);
        alert("Failed to push to Notion. Please check the console for more details.");
      }
    }
  };

  const handleSendEmail = async () => {
    if (email && allGeneratedContent) {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `${BACKEND_URL}/deliver/email`,
        new URLSearchParams({ to_email: email }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Bearer ${token}` } }
      );
      alert("Email sent!");
    } else {
      alert("Please enter an email address and generate content first.");
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-4 text-gray-800">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-3 mt-6 text-gray-700">{line.substring(3)}</h2>;
      } else if (line.startsWith('• ')) {
        return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
      } else if (line.startsWith('*') && line.endsWith('*')) {
        return <p key={index} className="italic text-gray-600 mt-4">{line.substring(1, line.length - 1)}</p>;
      } else if (line.trim()) {
        return <p key={index} className="mb-3 text-gray-700">{line}</p>;
      }
      return <br key={index} />;
    });
  };

  let contentToRender;
  if (currentView === 'home') {
    contentToRender = <Home onLoginClick={handleShowLogin} onSignupClick={handleShowSignup} />;
  } else if (currentView === 'auth') {
    contentToRender = <Auth onLoginSuccess={handleLoginSuccess} initialMode={authMode} />;
  } else {
    contentToRender = (
      <>
        {/* Main App Content */}
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="mb-6">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-pulse">
                  ✨ AI Content Generator
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Transform your brand story into compelling marketing content with the power of AI
              </p>
            </div>

            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
              {/* Form Section */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center mb-8">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Tell us about your brand</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FormField
                      label="Brand Name"
                      id="brand_name"
                      name="brand_name"
                      value={formData.brand_name}
                      onChange={handleChange}
                      placeholder="Your company name"
                      icon="🏢"
                    />
                    
                    <FormField
                      label="Industry"
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder="e.g. Fashion, Tech, Food"
                      icon="🏭"
                    />
                    
                    <FormField
                      label="Target Audience"
                      id="audience"
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      placeholder="e.g. Young professionals, Parents"
                      icon="👥"
                    />
                    
                    <div>
                      <label htmlFor="tone" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <span className="mr-2">🎭</span>
                        Brand Tone
                      </label>
                      <select
                        id="tone"
                        name="tone"
                        value={formData.tone}
                        onChange={handleChange}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      >
                        <option value="friendly">😊 Friendly</option>
                        <option value="professional">💼 Professional</option>
                        <option value="humorous">😄 Humorous</option>
                        <option value="formal">🎩 Formal</option>
                        <option value="casual">👋 Casual</option>
                      </select>
                    </div>
                  </div>
                  
                  <FormField
                    label="Goals & Objectives"
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    placeholder="What do you want to achieve with this content? Describe your marketing goals..."
                    textarea
                    rows={4}
                    icon="🎯"
                  />
                  
                  <FormField
                    label="Products & Services"
                    id="products"
                    name="products"
                    value={formData.products.join(', ')}
                    onChange={handleChange}
                    placeholder="List your key products or services (comma-separated)"
                    textarea
                    rows={3}
                    icon="📦"
                  />
                  
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={loading || !formData.brand_name.trim()}
                      className={`w-full py-6 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${loading ? 'animate-pulse' : ''}`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                          Crafting Your Content...
                        </>
                      ) : (
                        <>
                          <span className="mr-3">✨</span>
                          Generate Content Magic
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {showOptions && allGeneratedContent && (
              <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 animate-bounce-in">
                <div className="p-8 lg:p-12">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800">Your Generated Content</h2>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="flex items-center px-6 py-3 text-sm font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border-2 border-blue-600 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                  
                  {/* Display all generated content in separate cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allGeneratedContent.weekly_posts && (
                      <ContentCard title="Weekly Posts" content={allGeneratedContent.weekly_posts} formatContent={formatContent} />
                    )}
                    {allGeneratedContent.ad_copies && (
                      <ContentCard title="Ad Copies" content={allGeneratedContent.ad_copies} formatContent={formatContent} />
                    )}
                    {allGeneratedContent.visual_briefs && (
                      <ContentCard title="Visual Briefs" content={allGeneratedContent.visual_briefs} formatContent={formatContent} />
                    )}
                    {allGeneratedContent.hashtags && (
                      <ContentCard title="Hashtags" content={allGeneratedContent.hashtags} formatContent={formatContent} />
                    )}
                    {allGeneratedContent.platform_split && (
                      <ContentCard title="Platform Split" content={allGeneratedContent.platform_split} formatContent={formatContent} />
                    )}
                    {allGeneratedContent.whatsapp_broadcast && (
                      <ContentCard title="WhatsApp Broadcast" content={allGeneratedContent.whatsapp_broadcast} formatContent={formatContent} />
                    )}
                  </div>

                  <div className="mt-10 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Share your content</h3>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <textarea
                          className="w-full px-6 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm resize-none"
                          placeholder="Enter email addresses (comma-separated)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <button
                        onClick={handleSendEmail}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center font-semibold"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <footer className="mt-16 text-center text-gray-500 text-sm">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-4"></div>
            <p>© {new Date().getFullYear()} AI Content Generator. Crafted with ❤️ and AI</p>
          </footer>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          ✨ MarketCrew
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              {currentView !== 'auth' && ( // Only show if not already on auth page
                <>
                  <button
                    onClick={handleShowLogin}
                    className="px-4 py-2 mr-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleShowSignup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </nav>
      {contentToRender}
    </div>
  );
}

// Enhanced FormField component
interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  icon?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  textarea = false,
  rows = 1,
  icon,
}) => {
  return (
    <div className="group">
      <label htmlFor={id} className="flex items-center text-sm font-semibold text-gray-700 mb-3">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md resize-none group-hover:border-blue-300"
        />
      ) : (
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md group-hover:border-blue-300"
        />
      )}
    </div>
  );
};

interface ContentCardProps {
  title: string;
  content: string;
  formatContent: (content: string) => JSX.Element[];
}

const ContentCard: React.FC<ContentCardProps> = ({ title, content, formatContent }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-100 shadow-inner flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="prose max-w-none flex-grow">
        {formatContent(content)}
      </div>
    </div>
  );
};

export default App;