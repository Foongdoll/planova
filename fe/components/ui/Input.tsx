'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-0.5">
      {label && <label className="text-xs font-medium text-neutral-700">{label}</label>}
      <input
        className={`w-full rounded-lg border border-[#E7DDCB] bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#B9D98C] focus:ring-2 focus:ring-[#E8F3D8] transition placeholder:text-neutral-400 ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
