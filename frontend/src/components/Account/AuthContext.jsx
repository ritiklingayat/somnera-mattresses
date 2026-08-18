import { createContext, useContext, useState, useEffect } from 'react';
import {
  loginApi,
  registerApi,
  generateRegistrationOtpApi,
  sendOtpApi,
  verifyOtpApi,
  resendOtpApi,
  forgotPasswordApi,
  resetPasswordApi,
  getCurrentUserApi,
} from './authService';

const AuthContext = createContext(null);

export const AUTH_TOKEN_KEY = 'somnera_auth_token';
export const AUTH_USER_KEY = 'somnera_auth_user';

export function AuthProvider({ children, onAddToCartSuccess }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalView, setModalView] = useState('login'); // 'login' | 'register' | 'forgot-password' | 'reset-password'
  const [pendingCartItem, setPendingCartItem] = useState(null);
  const [resetToken, setResetToken] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const isLoggedIn = Boolean(token && user);

  // Sync token & user changes to localStorage
  const saveSession = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    if (newUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const openAuthModal = (view = 'login', item = null) => {
    setModalView(view);
    if (item) setPendingCartItem(item);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAuthModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res.token && res.user) {
      saveSession(res.token, res.user);
      try {
        const profile = await getCurrentUserApi();
        if (profile) saveSession(res.token, profile.user || profile);
      } catch {
        // The authenticated login response remains the source of profile data.
      }
      closeAuthModal();
      showToast(`Welcome back, ${res.user.firstName || 'Sleep Enthusiast'}!`);

      // Resume pending add to cart action if triggered prior to login
      if (pendingCartItem && onAddToCartSuccess) {
        onAddToCartSuccess(pendingCartItem);
        setPendingCartItem(null);
        showToast(`${pendingCartItem.name} added to your cart!`);
      }
      return res;
    }
    throw new Error(res.message || 'Login failed. Please verify credentials.');
  };

  const register = async (formData) => {
    const res = await registerApi(formData);
    if (res.token && res.user) {
      saveSession(res.token, res.user);
      closeAuthModal();
      showToast(`Account created successfully! Welcome to Somnera, ${res.user.firstName}.`);

      if (pendingCartItem && onAddToCartSuccess) {
        onAddToCartSuccess(pendingCartItem);
        setPendingCartItem(null);
        showToast(`${pendingCartItem.name} added to your cart!`);
      }
      return res;
    }
    throw new Error(res.message || 'Registration failed.');
  };

  const logout = () => {
    saveSession(null, null);
    if (['#profile', '#orders'].includes(window.location.hash)) {
      window.location.hash = 'home';
    }
    showToast('Logged out successfully.');
  };

  // Registration-specific OTP — sends { email } as required by backend
  const generateRegistrationOtp = async (email) => {
    return await generateRegistrationOtpApi(email);
  };

  const sendOtp = async (target, purpose = 'REGISTER') => {
    return await sendOtpApi(target, purpose);
  };

  const verifyOtp = async (target, otp, purpose = 'REGISTER') => {
    const res = await verifyOtpApi(target, otp, purpose);
    if (res.token) {
      setResetToken(res.token);
    }
    return res;
  };

  const resendOtp = async (target, purpose = 'REGISTER') => {
    return await resendOtpApi(target, purpose);
  };

  const forgotPassword = async (email) => {
    return await forgotPasswordApi({ email });
  };

  const resetPassword = async (newPassword, confirmPassword) => {
    if (!resetToken) throw new Error('Please verify the OTP before resetting your password.');
    const res = await resetPasswordApi({
      token: resetToken,
      newPassword,
      confirmPassword,
    });
    return res;
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        modalOpen,
        modalView,
        pendingCartItem,
        resetToken,
        toastMessage,
        setModalView,
        setResetToken,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        generateRegistrationOtp,
        sendOtp,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
