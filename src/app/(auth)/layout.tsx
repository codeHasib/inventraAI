import Navbar from "@/components/navbar";
import AuthHero from "@/components/auth-hero";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col bg-gray-50 transition-colors duration-300 dark:bg-[#050510]">
      <Navbar />

      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel — Typographic Hero Showcase (desktop only) */}
        <div className="hidden md:flex md:w-1/2 min-h-screen border-r border-white/5 overflow-hidden">
          <AuthHero />
        </div>

        {/* Right Panel — Centered Form Container */}
        <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-12 bg-zinc-950">
          {children}
        </div>
      </main>
    </div>
  );
}
