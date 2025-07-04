import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Auth from "./Auth";
import Home from "./Home";

const BACKEND_URL = "http://localhost:8000";

type FormData = {
  brand_name: string;
  industry: string;
  audience: string;
  tone: string;
  goals: string;
  products: string;
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
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'app'>('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState<FormData>({
    brand_name: "",
    industry: "",
    audience: "",
    tone: "friendly",
    goals: "",
    products: "",
  });
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [allGeneratedContent, setAllGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState<keyof GeneratedContent | null>(null);
  const [email, setEmail] = useState("");

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
    setFormData({
      brand_name: "",
      industry: "",
      audience: "",
      tone: "friendly",
      goals: "",
      products: "",
    });
    setLoading(false);
    setShowOptions(false);
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

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const requestData = {
        ...formData,
        products: formData.products.split(',').map(p => p.trim()).filter(p => p),
      };
      const response = await axios.post(`${BACKEND_URL}/generate`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllGeneratedContent(response.data.content);
      setShowOptions(true);
      setActiveTab('weekly_posts'); // Set the default active tab
    } catch (error) {
      console.error(error);
      // Removed alert, will use a more graceful error handling later
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
        return <h1 key={index} className="text-2xl font-bold mb-4 text-navy-secondary">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-3 mt-6 text-navy-primary">{line.substring(3)}</h2>;
      } else if (line.startsWith('• ') || line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1 text-navy-secondary/80">{line.substring(2)}</li>;
      } else if (line.startsWith('*') && line.endsWith('*')) {
        return <p key={index} className="italic text-rust mt-4">{line.substring(1, line.length - 1)}</p>;
      } else if (line.trim()) {
        return <p key={index} className="mb-3 text-navy-secondary/80">{line}</p>;
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
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-4">
                  ✨ AI Content Generator
                </h1>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '8rem' }}
                  className="h-1 w-32 bg-gradient-to-r from-navy-primary to-rust mx-auto rounded-full"
                />
              </div>
              <p className="text-xl text-navy-secondary/80 max-w-2xl mx-auto leading-relaxed">
                Transform your brand story into compelling marketing content with the power of AI
              </p>
            </motion.div>

            {/* Main Form */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-cream/50"
>
  <div className="p-8 lg:p-10">
    {/* Form Header */}
    <div className="flex items-center mb-10">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-navy-primary to-rust rounded-full flex items-center justify-center mr-4">
          <span className="text-white font-bold text-lg">1</span>
        </div>
        <div className="absolute -inset-2 rounded-full border-2 border-navy-primary/20 animate-pulse"></div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-navy-secondary">Tell us about your brand</h2>
        <p className="text-navy-primary/70 mt-1">Fill in the details to generate personalized content</p>
      </div>
    </div>
    
    {/* Form Fields */}
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FormField
          label="Brand Name"
          id="brand_name"
          name="brand_name"
          value={formData.brand_name}
          onChange={handleChange}
          placeholder="Your company name"
          icon={
            <div className="w-6 h-6 bg-navy-primary/10 rounded-full flex items-center justify-center text-navy-primary">
              🏢
            </div>
          }
        />
        
        <FormField
          label="Industry"
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g. Fashion, Tech, Food"
          icon={
            <div className="w-6 h-6 bg-navy-primary/10 rounded-full flex items-center justify-center text-navy-primary">
              🏭
            </div>
          }
        />
        
        <FormField
          label="Target Audience"
          id="audience"
          name="audience"
          value={formData.audience}
          onChange={handleChange}
          placeholder="e.g. Young professionals, Parents"
          icon={
            <div className="w-6 h-6 bg-navy-primary/10 rounded-full flex items-center justify-center text-navy-primary">
              👥
            </div>
          }
        />
        
        <div>
          <label htmlFor="tone" className="flex items-center text-sm font-medium text-navy-primary mb-3">
            <div className="w-6 h-6 bg-navy-primary/10 rounded-full flex items-center justify-center text-navy-primary mr-2">
              🎭
            </div>
            Brand Tone
          </label>
          <div className="relative">
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="form-select w-full pl-12 pr-4 py-3 border-2 border-navy-primary/10 rounded-xl focus:ring-2 focus:ring-navy-primary/30 focus:border-navy-primary bg-white appearance-none"
            >
              <option value="friendly">😊 Friendly</option>
              <option value="professional">💼 Professional</option>
              <option value="humorous">😄 Humorous</option>
              <option value="formal">🎩 Formal</option>
              <option value="casual">👋 Casual</option>
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="w-8 h-8 bg-navy-primary/5 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎭</span>
              </div>
            </div>
          </div>
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
        icon={
          <div className="w-6 h-6 bg-navy-primary/10 rounded-full flex items-center justify-center text-navy-primary">
            🎯
          </div>
        }
      />
      
      <FormField
        label="Products & Services"
        id="products"
        name="products"
        value={formData.products}
        onChange={handleChange}
        placeholder="List your key products or services (comma-separated)"
        textarea
        rows={3}
        icon={
          <div className="w-6 h-6 bg-navy-primary/10 rounded-full flex items-center justify-center text-navy-primary">
            📦
          </div>
        }
      />
      
      {/* Submit Button */}
      <div className="pt-8">
        <motion.button
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(37, 77, 112, 0.3)"
          }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGenerate}
          disabled={loading || !formData.brand_name.trim()}
          className="relative w-full py-5 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-navy-primary to-rust hover:from-navy-primary/90 hover:to-rust/90 transition-all duration-300 shadow-lg overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {/* Animated background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-navy-primary/30 to-rust/30"
            initial={{ x: "-100%" }}
            animate={{ x: loading ? "100%" : "0%" }}
            transition={{ 
              duration: loading ? 2 : 0,
              repeat: loading ? Infinity : 0,
              ease: "linear"
            }}
          />
          
          <div className="relative z-10 flex items-center justify-center">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                <span>Crafting Your Content...</span>
              </>
            ) : (
              <>
                <span className="mr-3 text-xl">✨</span>
                <span>Generate Content Magic</span>
              </>
            )}
          </div>
        </motion.button>
        
        {!formData.brand_name.trim() && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-rust mt-3 text-center"
          >
            Please enter your brand name to continue
          </motion.p>
        )}
      </div>
    </div>
  </div>
</motion.div>

            {/* Results Section */}
            {showOptions && allGeneratedContent && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium mt-12"
              >
                <div className="p-8 lg:p-12">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h2 className="text-3xl font-bold text-navy-secondary">Your Generated Content</h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="btn-outline flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </motion.button>
                  </div>
                  
                  <div className="flex border-b border-navy-primary/10 mb-6">
                    {Object.keys(allGeneratedContent).map((key) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key as keyof GeneratedContent)}
                        className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 ${
                          activeTab === key
                            ? 'border-b-2 border-rust text-rust'
                            : 'text-navy-primary/70 hover:text-navy-primary'
                        }`}
                      >
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>

                  <div className="p-6 bg-white rounded-lg shadow-inner border border-navy-primary/10">
                    {activeTab && (
                      <ContentCard
                        title={activeTab.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        content={allGeneratedContent[activeTab] || ''}
                        formatContent={formatContent}
                      />
                    )}
                  </div>

                  <div className="mt-10 p-6 bg-gradient-to-r from-cream/50 to-cream/30 rounded-xl border border-rust/20">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-rust to-navy-primary rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h3 className="text-xl font-bold text-navy-secondary">Share your content</h3>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <textarea
                          className="form-input w-full"
                          placeholder="Enter email addresses (comma-separated)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendEmail}
                        className="btn-secondary px-8 py-4 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Email
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          <footer className="mt-16 text-center text-navy-secondary/60 text-sm">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-navy-primary/30 to-transparent mx-auto mb-4"></div>
            <p>© {new Date().getFullYear()} MarketCrew. Crafted with ❤️ and AI</p>
          </footer>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <nav className="bg-white/90 backdrop-blur-sm shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-gradient-primary cursor-pointer"
          onClick={handleHomeClick}
        >
          MarketCrew
        </motion.div>
        <div>
          {isLoggedIn ? (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHomeClick}
                className="btn-outline px-4 py-2"
              >
                Home
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn-secondary px-4 py-2"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <>
              {currentView !== 'auth' && (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShowLogin}
                    className="btn-outline px-4 py-2"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShowSignup}
                    className="btn-primary px-4 py-2"
                  >
                    Sign Up
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
      {contentToRender}
    </div>
  );
}

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
    <motion.div 
      whileHover={{ y: -2 }}
      className="group"
    >
      <label htmlFor={id} className="flex items-center text-sm font-semibold text-navy-primary mb-3">
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
          className="form-input w-full"
        />
      ) : (
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input w-full"
        />
      )}
    </motion.div>
  );
};

interface ContentCardProps {
  title: string;
  content: string;
  formatContent: (content: string) => JSX.Element[];
}

const ContentCard: React.FC<ContentCardProps> = ({ title, content, formatContent }) => {
  return (
    <div className="bg-white p-6 rounded-xl flex flex-col">
      <h3 className="text-2xl font-bold text-navy-secondary mb-4">{title}</h3>
      <div className="prose max-w-none flex-grow overflow-y-auto">
        {formatContent(content)}
      </div>
    </div>
  );
};

export default App;