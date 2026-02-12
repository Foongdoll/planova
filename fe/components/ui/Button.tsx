'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-3 py-1.5 text-xs',
  };
  const variants = {
    primary: 'bg-[#CFE8A9] hover:bg-[#BEE38A] border border-[#B9D98C]',
    secondary: 'bg-[#E8F3D8] hover:bg-[#DDF0C4] border border-[#E7DDCB]',
    ghost: 'hover:bg-[#F2E9DA] border border-transparent',
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
