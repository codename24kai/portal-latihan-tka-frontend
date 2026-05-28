import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * ToastNotification Setup: Global toast provider with custom 'Tinted & Soft' styling.
 * Matches the portal's aesthetic for Success and Error states.
 */
const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Global styles
        className: 'font-bold text-sm rounded-2xl shadow-xl border-0',
        duration: 4000,
        style: {
          padding: '16px 24px',
          borderRadius: '20px',
        },
        // Success state styling
        success: {
          style: {
            background: '#F0FDF4', // emerald-50
            color: '#059669', // emerald-600
            border: '1px solid #D1FAE5',
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
        },
        // Error state styling
        error: {
          style: {
            background: '#FEF2F2', // rose-50
            color: '#E11D48', // rose-600
            border: '1px solid #FFE4E6',
          },
          iconTheme: {
            primary: '#F43F5E',
            secondary: '#FFFFFF',
          },
        },
      }}
      containerStyle={{
          top: 40,
          right: 40,
      }}
    />
  );
};

// Dark mode aware variant handles the class switching externally or via standard Tailwind
// For deeper dark mode support, we can use a functional component to detect theme
export default ToastProvider;
