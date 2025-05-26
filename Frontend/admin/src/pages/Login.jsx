import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createHR, loginHR } from "../api/hr";

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-black/5"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Animated grid background
const AnimatedGrid = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent" />
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    location: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.company ||
      !form.location ||
      !form.description
    ) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
      // Format data as expected by backend
      const payload = {
        hr_username: form.username,
        hr_pass: form.password,
        hr_email: form.email,
        hr_company: form.company,
        hr_location: form.location,
        hr_description: form.description,
      };
      await createHR(payload);
      setSuccess("Account created successfully! Welcome aboard!");
      setIsSignup(false);
      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        company: "",
        location: "",
        description: "",
      });
    } catch (err) {
      console.error(err?.response?.data || err);
      setError(
        err?.response?.data?.message || "Signup failed. Please try again."
      );
    }
    setIsLoading(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        hr_email: form.email, // or form.username if you want username login
        hr_pass: form.password,
      };
      const hr = await loginHR(payload);
      // Save HR object and random sessionid in localStorage
      localStorage.setItem("hr", JSON.stringify(hr));
      localStorage.setItem(
        "sessionid",
        Math.random().toString(36).substring(2)
      );
      setSuccess("Welcome back! Redirecting to your dashboard...");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err?.response?.data || err);
      setError(
        err?.response?.data?.message || "Invalid credentials. Please try again."
      );
      setSuccess("");
    }
    setIsLoading(false);
  };

  const inputVariants = {
    focus: "ring-2 ring-blue-400/50 border-blue-400/50 bg-white",
    default: "border-black/10 bg-white/80 hover:bg-white",
  };

  return (
    <div className="h-screen relative overflow-hidden bg-white">
      {/* Dynamic gradient background */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Animated grid and particles */}
      <AnimatedGrid />
      <FloatingParticles />

      <div className="relative z-10 h-screen flex flex-col items-center justify-center p-4">
        {/* Logo area with subtle glow */}
        <div className="mb-6 relative group">
          <div className="absolute -inset-4 bg-blue-100 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-all duration-300" />
          <div className="relative flex items-center space-x-3 px-5 py-2 rounded-full bg-white shadow-lg">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold text-gray-900">HiroBot</span>
          </div>
        </div>

        {/* Main form container */}
        <div className="w-full max-w-md relative">
          {/* Glassmorphism container */}
          <div className="relative group">
            {/* Subtle glow */}
            <div className="absolute -inset-1 bg-blue-100 rounded-2xl blur-xl opacity-70 group-hover:opacity-80 transition-all duration-300" />

            {/* Main form */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-black/5 p-6 shadow-lg">
              {/* Form header */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                  {isSignup ? "Join the Future" : "Welcome Back"}
                </h2>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {isSignup
                    ? "Create your account and step into tomorrow"
                    : "Sign in to access your dashboard"}
                </p>
              </div>

              {/* Status messages */}
              {error && (
                <div className="mb-4 p-2 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-red-600 text-xs font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-4 p-2 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-green-600 text-xs font-medium">
                    {success}
                  </p>
                </div>
              )}

              {/* Form fields */}
              <div className="space-y-4">
                {isSignup ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left column */}
                    <div className="space-y-4">
                      {/* Username */}
                      <div className="group">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm placeholder:text-sm border-black/10 bg-white/80"
                          />
                        </div>
                      </div>
                      {/* Email */}
                      <div className="group">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm placeholder:text-sm border-black/10 bg-white/80"
                          />
                        </div>
                      </div>
                      {/* Company */}
                      <div className="group">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="company"
                            placeholder="Enter your company"
                            value={form.company}
                            onChange={handleChange}
                            className="w-full pl-3 pr-3 py-2 rounded-lg border text-sm placeholder:text-sm border-black/10 bg-white/80"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Right column */}
                    <div className="space-y-4">
                      {/* Password */}
                      <div className="group">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full pl-9 pr-9 py-2 rounded-lg border text-sm placeholder:text-sm border-black/10 bg-white/80"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      {/* Confirm Password */}
                      <div className="group">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-9 pr-9 py-2 rounded-lg border text-sm placeholder:text-sm border-black/10 bg-white/80"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      {/* Location */}
                      <div className="group">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="location"
                            placeholder="Enter your location"
                            value={form.location}
                            onChange={handleChange}
                            className="w-full pl-3 pr-3 py-2 rounded-lg border text-sm placeholder:text-sm border-black/10 bg-white/80"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // ...existing code for login fields...
                  <>
                    {/* Email */}
                    <div className="group">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm placeholder:text-sm border-black/10 bg-white/80"
                        />
                      </div>
                    </div>
                    {/* Password */}
                    <div className="group">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={form.password}
                          onChange={handleChange}
                          className="w-full pl-9 pr-9 py-2 rounded-lg border text-sm placeholder:text-sm border-black/10 bg-white/80"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {/* Description (always on signup, full width below grid) */}
                {isSignup && (
                  <div className="group">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="description"
                        placeholder="Enter a short description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full pl-3 pr-3 py-2 rounded-lg border text-sm placeholder:text-sm border-black/10 bg-white/80"
                      />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={isSignup ? handleSignup : handleLogin}
                  disabled={isLoading}
                  className="group relative w-full mt-2 py-2.5 px-4 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <div className="relative flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>{isSignup ? "Create Account" : "Sign In"}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Toggle auth mode */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                  setSuccess("");
                  setForm({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    company: "",
                    location: "",
                    description: "",
                  });
                }}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
              >
                {isSignup ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-6 text-center text-gray-400 text-xs">
          <p>Automate • Evaluate • Hire Smart • Powered by HiroBot</p>
        </div>
      </div>
    </div>
  );
}
