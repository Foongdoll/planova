'use client';

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E7DDCB] border-t-[#CFE8A9]" />
    </div>
  );
}
