import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F7F6] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-[#E1ECE9] shadow-xl flex flex-col items-center max-w-sm w-full text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#075E54] flex items-center justify-center text-white shadow-lg shadow-emerald-950/20">
              <ShieldCheck className="w-9 h-9 text-white animate-pulse" />
            </div>
            <Loader2 className="w-6 h-6 text-[#10B981] animate-spin absolute -bottom-1 -right-1" />
          </div>

          <div>
            <h3 className="font-bold text-lg text-[#173B38] tracking-tight">Tikakaran HMIS</h3>
            <p className="text-xs text-[#718783] mt-1 font-medium">Verifying ANM Portal Credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#173B38]">Unauthorized Access</h2>
        <p className="text-sm text-[#718783] max-w-md">
          Your role ({user?.role}) does not have permission to access this module. Please contact your PHC Medical Officer Incharge.
        </p>
      </div>
    );
  }

  return children;
}

