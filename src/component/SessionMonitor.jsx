import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust import path
import { LogIn, AlertCircle, X } from "lucide-react";
import { api } from "../utils/app";

const SessionMonitor = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout, token } = useAuth();

  // Function to check session
  const checkSession = async () => {
    // Don't check if no token or already showing popup
    if (!token || showPopup || isChecking) return;

    setIsChecking(true);
    try {
      // Call your current user API
      await api.get("/user"); // Adjust endpoint as needed
      // If successful, session is valid
      setIsChecking(false);
    } catch (error) {
      console.error("Session check failed:", error);
      
      // Check if it's an authentication error (401)
      if (error.status === 401 || error.status === 500) {
        // Session expired
        setShowPopup(true);
        startCountdown();
      }
      setIsChecking(false);
    }
  };

  // Start countdown for auto-redirect
  const startCountdown = () => {
    setCountdown(30);
    
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto redirect when countdown reaches 0
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle logout and redirect
  const handleLogout = () => {
    // Clear all intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    // Logout user
    logout();
    
    // Hide popup
    setShowPopup(false);
    
    // Redirect to login
    navigate("/login", { 
      state: { 
        message: "Your session has expired. Please login again." 
      } 
    });
  };

  // Handle manual login redirect
  const handleLoginRedirect = () => {
    // Clear intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    // Hide popup
    setShowPopup(false);
    
    // Redirect to login
    navigate("/login", { 
      state: { 
        message: "Please login to continue." 
      } 
    });
  };

  // Setup periodic session checking
  useEffect(() => {
    // Only start checking if user is logged in
    if (token) {
      // Check immediately on mount
      checkSession();

      // Set up interval to check every 5 minutes (adjust as needed)
      intervalRef.current = setInterval(checkSession, 5 * 60 * 1000);

      // Also check on tab visibility change
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          checkSession();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Check on network reconnection
      const handleOnline = () => {
        checkSession();
      };

      window.addEventListener('online', handleOnline);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('online', handleOnline);
      };
    }
  }, [token]);

  // Add interceptor to catch 401 responses from any API call
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.status === 401 && token) {
          // Don't show popup if already showing
          if (!showPopup) {
            setShowPopup(true);
            startCountdown();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [token, showPopup]);

  return (
    <>
      {children}
      
      {/* Session Expired Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black transition-opacity"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => {}} // Prevent closing on backdrop click
          ></div>

          {/* Popup */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <div 
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              style={{ 
                backgroundColor: '#FFFFFF',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                border: '1px solid #E2E8F0'
              }}
            >
              {/* Close button - disabled during countdown */}
              <button
                onClick={handleLoginRedirect}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                style={{ color: '#94A3B8' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#64748B'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div 
                  className="p-3 rounded-full"
                  style={{ backgroundColor: '#FEF2F2' }}
                >
                  <AlertCircle className="w-8 h-8" style={{ color: '#DC2626' }} />
                </div>
              </div>

              {/* Title */}
              <h3 
                className="text-xl font-bold text-center mb-2"
                style={{ color: '#0F172A' }}
              >
                Session Expired
              </h3>

              {/* Message */}
              <p 
                className="text-center mb-4"
                style={{ color: '#64748B' }}
              >
                Your session has expired due to inactivity. 
                Please login again to continue using ReqTrack.
              </p>

              {/* Countdown */}
              <div className="text-center mb-6">
                <span 
                  className="text-sm font-medium"
                  style={{ color: '#2563EB' }}
                >
                  Auto-redirecting in {countdown} seconds
                </span>
              </div>

              {/* Progress bar */}
              <div 
                className="w-full h-1 rounded-full mb-6"
                style={{ backgroundColor: '#E2E8F0' }}
              >
                <div 
                  className="h-1 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${(countdown / 30) * 100}%`,
                    backgroundColor: '#2563EB'
                  }}
                ></div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-semibold transition-all duration-300"
                  style={{ 
                    backgroundColor: '#2563EB'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login Now</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 border rounded-lg font-medium transition-all duration-300"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    color: '#64748B'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.borderColor = '#CBD5E1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionMonitor;