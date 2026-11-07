import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Building2, 
  CheckCircle2, 
  Thermometer, 
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('anm.pipariya@mphealth.gov.in');
  const [password, setPassword] = useState('ANM@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both registered email and password.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      toast.success(
        `Namaste, ${loggedUser.fullName}! 👋`,
        `Successfully logged into ${loggedUser.subCentre} (${loggedUser.subCentreCode}).`
      );
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F1F7F6] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar with Govt Health Mission Badge */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#075E54] flex items-center justify-center text-white shadow-md shadow-emerald-950/20 ring-2 ring-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#173B38] font-sans">
                Tikakaran
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#075E54] text-white px-1.5 py-0.5 rounded">
                HMIS
              </span>
            </div>
            <p className="text-[11px] text-[#718783] font-medium leading-none">
              Auxiliary Nurse Midwife & Sub-Centre Portal
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-[#E1ECE9] shadow-soft-sm text-xs font-semibold text-[#075E54]">
          <Thermometer className="w-4 h-4 text-emerald-500" />
          <span>Cold Chain: 4.2°C Safe</span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-3xl border border-[#E1ECE9] shadow-xl p-6 sm:p-8 space-y-6"
        >
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#E6F4F1] text-[#075E54] mb-1">
              <Building2 className="w-6 h-6 text-[#075E54]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#173B38] tracking-tight">
              Health Worker Login
            </h1>
            <p className="text-xs sm:text-sm text-[#718783]">
              Enter your official government credentials to access Sub-Centre immunization registers.
            </p>
          </div>

          {/* Error Alert Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-snug">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#173B38] mb-1.5">
                Official Email / Portal ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718783]">
                  <Mail className="w-4 h-4 text-[#718783]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mphealth.gov.in"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F1F7F6] focus:bg-white text-xs sm:text-sm text-[#173B38] placeholder-[#8EA29E] rounded-xl border border-transparent focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 outline-none transition duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#173B38]">
                  Password
                </label>
                <span className="text-[11px] text-[#075E54] hover:underline cursor-pointer font-medium">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718783]">
                  <Lock className="w-4 h-4 text-[#718783]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F1F7F6] focus:bg-white text-xs sm:text-sm text-[#173B38] placeholder-[#8EA29E] rounded-xl border border-transparent focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 outline-none transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#718783] hover:text-[#173B38]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#075E54] hover:bg-[#064C44] text-white rounded-xl text-sm font-bold shadow-md shadow-[#075E54]/20 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#10B981]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Sub-Centre</span>
                  <ArrowRight className="w-4 h-4 text-[#10B981]" />
                </>
              )}
            </motion.button>
          </form>

          {/* Quick-Fill Demo Credentials Selector */}
          <div className="pt-4 border-t border-[#E1ECE9] space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#718783] block text-center">
              Quick-Select Verified Government Roles
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('anm.pipariya@mphealth.gov.in', 'ANM@12345')}
                className={`p-2 rounded-xl border text-left transition ${
                  email === 'anm.pipariya@mphealth.gov.in'
                    ? 'border-[#10B981] bg-[#E6F4F1] text-[#075E54] font-bold'
                    : 'border-[#E1ECE9] hover:bg-[#F9FCFA] text-[#173B38]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-[#10B981]" />
                  <span>ANM Pipariya</span>
                </div>
                <span className="text-[10px] text-[#718783] block mt-0.5 truncate">SC-49201 Worker</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('moic.rampur@mphealth.gov.in', 'Moic@12345')}
                className={`p-2 rounded-xl border text-left transition ${
                  email === 'moic.rampur@mphealth.gov.in'
                    ? 'border-[#10B981] bg-[#E6F4F1] text-[#075E54] font-bold'
                    : 'border-[#E1ECE9] hover:bg-[#F9FCFA] text-[#173B38]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#075E54]" />
                  <span>PHC Incharge</span>
                </div>
                <span className="text-[10px] text-[#718783] block mt-0.5 truncate">Medical Officer</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin.jabalpur@mphealth.gov.in', 'Admin@12345')}
                className={`p-2 rounded-xl border text-left transition ${
                  email === 'admin.jabalpur@mphealth.gov.in'
                    ? 'border-[#10B981] bg-[#E6F4F1] text-[#075E54] font-bold'
                    : 'border-[#E1ECE9] hover:bg-[#F9FCFA] text-[#173B38]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-purple-600" />
                  <span>District Admin</span>
                </div>
                <span className="text-[10px] text-[#718783] block mt-0.5 truncate">District Incharge</span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto text-center py-4 text-xs text-[#718783] border-t border-[#E1ECE9]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Ministry of Health & Family Welfare (MoHFW), Universal Immunization Programme</p>
        <div className="flex items-center gap-4 text-[#075E54] font-semibold text-[11px]">
          <span className="flex items-center gap-1">
            <PhoneCall className="w-3 h-3" />
            National Helpdesk: 1800-180-1104
          </span>
        </div>
      </footer>
    </div>
  );
}

