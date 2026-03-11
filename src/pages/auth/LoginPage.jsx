import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowLeft, Users, Building2, Briefcase, FileCheck, UserCog } from "lucide-react";
import CustomInput from "../../component/form/CustomInput";
import { useAuth } from "../../context/AuthContext"; // Adjust the import path
import { api } from "../../utils/app";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear API error when user types
    if (apiError) {
      setApiError("");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setApiError("");

      try {
        // Make API call to login endpoint
        const response = await api.post("/login", {
          email: formData.email,
          password: formData.password,
        });

        // Check if login was successful
        if (response.data && response.data.token) {
          // Extract user data and token from response
          // Adjust this based on your actual API response structure
          const { token, user } = response.data;
          
          // Store auth data using AuthContext
          login(user, token);
          
          console.log("Login successful:", user);
          
          // Redirect based on user role
          if (user.role_id === 1) {
            navigate("/admin");
            toast.success("Super Admin Login Successful")
          } else if (user.role === "org_admin") {
            navigate("/org-admin/dashboard");
          } else if (user.role === "hr") {
            navigate("/hr/dashboard");
          } else if (user.role === "manager") {
            navigate("/manager/dashboard");
          } else if (user.role === "vendor") {
            navigate("/vendor/dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          setApiError("Invalid response from server");
        }
      } catch (error) {
        console.error("Login error:", error);
        
        // Handle different error scenarios
        if (error.status === 401) {
          setApiError("Invalid email or password");
        } else if (error.status === 403) {
          setApiError("Your account is not active. Please contact support.");
        } else if (error.status === 429) {
          setApiError("Too many login attempts. Please try again later.");
        } else if (error.message) {
          setApiError(error.message);
        } else {
          setApiError("Unable to connect to server. Please check your internet connection.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Quick fill super admin credentials for demo
  const fillSuperAdminCredentials = () => {
    setFormData({
      email: "admin@reqtrack.com",
      password: "password"
    });
    setApiError(""); // Clear any API error
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#F1F5F9' }}
    >
      {/* Background decoration with your accent colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: '#14B8A6', opacity: '0.1' }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: '#2563EB', opacity: '0.1' }}
        ></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center space-x-2 transition-colors group"
          style={{ color: '#64748B' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Login Card */}
        <div 
          className="rounded-2xl shadow-lg p-8"
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            border: '1px solid #E2E8F0'
          }}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div 
                className="p-3 rounded-2xl shadow-lg flex items-center justify-center"
                style={{ backgroundColor: '#2563EB' }}
              >
                <FileCheck className="w-10 h-10" style={{ color: '#FFFFFF' }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#0F172A' }}>
              Welcome to ReqTrack
            </h2>
            <p style={{ color: '#64748B' }}>
              Requirement & Recruitment Management System
            </p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div 
              className="mb-6 p-4 rounded-lg flex items-start space-x-3"
              style={{ 
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA'
              }}
            >
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" style={{ color: '#DC2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: '#991B1B' }}>{apiError}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "border-red-500" : ""}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: errors.email ? '#EF4444' : '#CBD5E1'
                }}
              />
              {errors.email && (
                <p className="mt-2 text-sm flex items-center" style={{ color: '#EF4444' }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: '#EF4444' }}
                  ></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <CustomInput
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? "border-red-500" : ""}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: errors.password ? '#EF4444' : '#CBD5E1'
                }}
              />
              {errors.password && (
                <p className="mt-2 text-sm flex items-center" style={{ color: '#EF4444' }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: '#EF4444' }}
                  ></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded cursor-pointer"
                  style={{ 
                    borderColor: '#CBD5E1',
                    color: '#2563EB'
                  }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm cursor-pointer"
                  style={{ color: '#64748B' }}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-semibold transition-colors"
                  style={{ color: '#2563EB' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1D4ED8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#2563EB'}
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              style={{ 
                backgroundColor: '#2563EB'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#1D4ED8';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In to ReqTrack</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid #E2E8F0' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2" style={{ 
                  backgroundColor: '#FFFFFF',
                  color: '#94A3B8'
                }}>
                  Demo Access
                </span>
              </div>
            </div>
          </div>

          {/* Demo Credentials - Updated with ReqTrack credentials */}
          <div className="mt-6">
            <div 
              className="rounded-lg p-4"
              style={{ 
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: '#0F172A' }}>
                  Quick Login Demo:
                </p>
                <button
                  type="button"
                  onClick={fillSuperAdminCredentials}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{ 
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                >
                  Fill Super Admin
                </button>
              </div>
              
              <div className="space-y-2">
                {/* Super Admin - Highlighted */}
                <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#DBEAFE' }}>
                  <div className="flex items-center space-x-2">
                    <UserCog className="w-4 h-4" style={{ color: '#2563EB' }} />
                    <div>
                      <p className="text-xs font-medium" style={{ color: '#0F172A' }}>Super Admin</p>
                      <p className="text-xs font-mono" style={{ color: '#2563EB' }}>admin@reqtrack.com</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>password</span>
                </div>

                {/* Other Roles */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded" style={{ backgroundColor: '#F1F5F9' }}>
                    <p style={{ color: '#64748B' }}>Organization Admin</p>
                    <p className="font-mono" style={{ color: '#14B8A6' }}>org@reqtrack.com</p>
                  </div>
                  <div className="p-2 rounded" style={{ backgroundColor: '#F1F5F9' }}>
                    <p style={{ color: '#64748B' }}>HR / Recruiter</p>
                    <p className="font-mono" style={{ color: '#8B5CF6' }}>hr@reqtrack.com</p>
                  </div>
                  <div className="p-2 rounded" style={{ backgroundColor: '#F1F5F9' }}>
                    <p style={{ color: '#64748B' }}>Department Manager</p>
                    <p className="font-mono" style={{ color: '#F59E0B' }}>manager@reqtrack.com</p>
                  </div>
                  <div className="p-2 rounded" style={{ backgroundColor: '#F1F5F9' }}>
                    <p style={{ color: '#64748B' }}>Vendor</p>
                    <p className="font-mono" style={{ color: '#EF4444' }}>vendor@reqtrack.com</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs mt-3 text-center" style={{ color: '#94A3B8' }}>
                All accounts use password: <span className="font-mono" style={{ color: '#2563EB' }}>password</span>
              </p>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#64748B' }}>
              New to ReqTrack?{" "}
              <a
                href="/register"
                className="font-semibold transition-colors"
                style={{ color: '#2563EB' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#1D4ED8'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#2563EB'}
              >
                Contact your organization admin
              </a>
            </p>
          </div>

          {/* ReqTrack Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs" style={{ color: '#94A3B8' }}>
              © 2024 ReqTrack. All rights reserved. | v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;