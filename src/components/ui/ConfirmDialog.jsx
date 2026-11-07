import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this healthcare action?",
  confirmText = "Yes, Confirm",
  cancelText = "Cancel",
  type = "danger", // 'danger' | 'warning' | 'info'
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="bg-white rounded-3xl shadow-2xl border border-[#E1ECE9] w-full max-w-md overflow-hidden relative"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              type === 'danger' ? 'bg-rose-100 text-rose-600' :
              type === 'warning' ? 'bg-amber-100 text-amber-600' :
              'bg-[#E6F4F1] text-[#075E54]'
            }`}>
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="flex-1">
              <h3 className="text-base font-bold text-[#173B38] leading-tight">
                {title}
              </h3>
              <p className="text-xs text-[#718783] mt-1.5 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E1ECE9] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-[#E1ECE9] text-xs font-bold text-[#718783] hover:bg-[#F1F7F6] transition"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5 ${
                type === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  : 'bg-[#075E54] hover:bg-[#064C44] shadow-[#075E54]/20'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

