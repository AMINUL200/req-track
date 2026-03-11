import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft, Check, Briefcase, Building2, Shield } from "lucide-react";
import CustomInput from "../../component/form/CustomInput";
import { api } from "../../utils/app";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    role: "user",
    organization_id: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const navigate = useNavigate();

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

  // Handle role selection
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData((prev) => ({
      ...prev,
      role: role
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
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
      setSuccessMessage("");
      
      // Prepare the data in the required format
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone.replace(/\D/g, ""), // Clean phone number
        role: formData.role,
        // Include organization_id if user is registering under an organization
        // organization_id: formData.organization_id
      };

      try {
        // Make API call to register endpoint
        // Adjust the endpoint based on your backend API structure
        const response = await api.post("/register", registrationData);
        
        // Check if registration was successful
        if (response.data) {
          console.log("Registration successful:", response.data);
          
          // Set success message
          setSuccessMessage(response.data.message || "Registration successful! Please check your email to verify your account.");
          
          // Clear form
          setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            phone: "",
            role: "user",
            organization_id: null
          });
          setSelectedRole("user");
          setAgreedToTerms(false);
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login", { 
              state: { 
                message: "Registration successful! Please login with your credentials." 
              } 
            });
          }, 3000);
        }
      } catch (error) {
        console.error("Registration error:", error);
        
        // Handle different error scenarios
        if (error.status === 422) {
          // Validation errors from backend
          if (error.data && error.data.errors) {
            // Map backend validation errors to form fields
            const backendErrors = {};
            Object.keys(error.data.errors).forEach(key => {
              // Map backend field names to frontend field names if different
              if (key === 'password_confirmation' || key === 'confirm_password') {
                backendErrors.password_confirmation = error.data.errors[key][0];
              } else {
                backendErrors[key] = error.data.errors[key][0];
              }
            });
            setErrors(backendErrors);
          } else {
            setApiError(error.message || "Validation failed. Please check your input.");
          }
        } else if (error.status === 409) {
          // Conflict - email already exists
          setApiError("Email already registered. Please use a different email or try logging in.");
        } else if (error.status === 429) {
          setApiError("Too many registration attempts. Please try again later.");
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

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#F1F5F9' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: '#14B8A6', opacity: '0.1' }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: '#2563EB', opacity: '0.05' }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: '#8B5CF6', opacity: '0.1' }}
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

        {/* Register Card */}
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
                className="p-3 rounded-2xl shadow-lg"
                style={{ backgroundColor: '#2563EB' }}
              >
                <Briefcase className="w-10 h-10" style={{ color: '#FFFFFF' }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#0F172A' }}>
              Join ReqTrack
            </h2>
            <p style={{ color: '#64748B' }}>
              Create your account to get started
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div 
              className="mb-6 p-4 rounded-lg flex items-start space-x-3"
              style={{ 
                backgroundColor: '#ECFDF3',
                border: '1px solid #ABEFC6'
              }}
            >
              <div className="flex-shrink-0">
                <Check className="h-5 w-5" style={{ color: '#067647' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: '#067647' }}>{successMessage}</p>
                <p className="text-xs mt-1" style={{ color: '#067647' }}>Redirecting to login page...</p>
              </div>
            </div>
          )}

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

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
              I want to register as
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange("user")}
                className="p-2 rounded-lg text-xs font-medium transition-all"
                style={{ 
                  backgroundColor: selectedRole === "user" ? '#2563EB' : '#F1F5F9',
                  color: selectedRole === "user" ? '#FFFFFF' : '#64748B',
                  border: selectedRole === "user" ? 'none' : '1px solid #E2E8F0'
                }}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("vendor")}
                className="p-2 rounded-lg text-xs font-medium transition-all"
                style={{ 
                  backgroundColor: selectedRole === "vendor" ? '#14B8A6' : '#F1F5F9',
                  color: selectedRole === "vendor" ? '#FFFFFF' : '#64748B',
                  border: selectedRole === "vendor" ? 'none' : '1px solid #E2E8F0'
                }}
              >
                Vendor
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("manager")}
                className="p-2 rounded-lg text-xs font-medium transition-all"
                style={{ 
                  backgroundColor: selectedRole === "manager" ? '#8B5CF6' : '#F1F5F9',
                  color: selectedRole === "manager" ? '#FFFFFF' : '#64748B',
                  border: selectedRole === "manager" ? 'none' : '1px solid #E2E8F0'
                }}
              >
                Manager
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
              Organization/HR admins will be created by Super Admin
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <CustomInput
                label="Full Name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: errors.name ? '#EF4444' : '#CBD5E1'
                }}
              />
              {errors.name && (
                <p className="mt-2 text-sm flex items-center" style={{ color: '#EF4444' }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: '#EF4444' }}
                  ></span>
                  {errors.name}
                </p>
              )}
            </div>

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

            {/* Phone Field */}
            <div>
              <CustomInput
                label="Phone Number"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                className={errors.phone ? "border-red-500" : ""}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: errors.phone ? '#EF4444' : '#CBD5E1'
                }}
              />
              {errors.phone && (
                <p className="mt-2 text-sm flex items-center" style={{ color: '#EF4444' }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: '#EF4444' }}
                  ></span>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <CustomInput
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div>
              <CustomInput
                label="Confirm Password"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.password_confirmation ? "border-red-500" : ""}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: errors.password_confirmation ? '#EF4444' : '#CBD5E1'
                }}
              />
              {errors.password_confirmation && (
                <p className="mt-2 text-sm flex items-center" style={{ color: '#EF4444' }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: '#EF4444' }}
                  ></span>
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 rounded cursor-pointer"
                  style={{ 
                    borderColor: '#CBD5E1',
                    color: '#2563EB'
                  }}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="cursor-pointer" style={{ color: '#64748B' }}>
                  I agree to the{" "}
                  <a 
                    href="/terms" 
                    className="font-medium"
                    style={{ color: '#2563EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#1D4ED8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#2563EB'}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a 
                    href="/privacy"
                    className="font-medium"
                    style={{ color: '#2563EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#1D4ED8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#2563EB'}
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            {errors.terms && (
              <p className="text-sm" style={{ color: '#EF4444' }}>{errors.terms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || successMessage}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              style={{ 
                backgroundColor: '#2563EB'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !successMessage) {
                  e.currentTarget.style.backgroundColor = '#1D4ED8';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !successMessage) {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Data Quick Fill */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: "New User",
                  email: `user${Math.floor(Math.random() * 1000)}@example.com`,
                  password: "password123",
                  password_confirmation: "password123",
                  phone: "9999999999",
                  role: selectedRole
                });
                setApiError(""); // Clear any API error
              }}
              className="w-full text-xs py-2 px-3 rounded-lg transition-colors"
              style={{ 
                backgroundColor: '#F1F5F9',
                color: '#64748B',
                border: '1px dashed #CBD5E1'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DBEAFE';
                e.currentTarget.style.color = '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.color = '#64748B';
              }}
            >
              Fill Demo Data
            </button>
          </div>

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
                  Already registered?
                </span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#64748B' }}>
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold transition-colors"
                style={{ color: '#2563EB' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#1D4ED8'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#2563EB'}
              >
                Sign in here
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

export default RegisterPage;