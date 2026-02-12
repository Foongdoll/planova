import "./globals.css";

export const metadata = {
  title: "Planova",
  description: "Project management with tree + DAG + flow canvas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="h-screen w-screen overflow-hidden bg-[#F7F2E8] text-neutral-900">
        {children}
      </body>
    </html>
  );
}
