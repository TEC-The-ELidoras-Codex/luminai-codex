import "./styles/globals.css";

export const metadata = {
  title: "LuminAI Wireframe Viewer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0F0F23] text-white">{children}</body>
    </html>
  );
}
