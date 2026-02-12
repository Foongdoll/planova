export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full items-center justify-center bg-[#F7F2E8] px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#E7DDCB] bg-white p-5 sm:p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}
