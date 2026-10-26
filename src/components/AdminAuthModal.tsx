import React from 'react';
import { X } from 'lucide-react';
import { AdminLoginPanel } from './AdminLoginPanel';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto" dir="rtl">
      <div 
        className="relative w-full max-w-lg my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <AdminLoginPanel 
          onSuccess={onSuccess} 
          onCancel={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
};
