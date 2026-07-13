import Navbar from "@/components/navbar";
import InventoryMockup from "@/components/inventory-mockup";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col bg-gray-50 transition-colors duration-300 dark:bg-[#050510]">
      <Navbar />

      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel — Immersive Hero Visual (desktop only) */}
        <div className="hidden md:flex md:w-1/2 min-h-screen bg-slate-950 border-r border-white/5 relative items-center justify-center p-12 overflow-hidden">
          {/* Subtle dark grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          {/* Deep indigo ambient glow orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
          {/* Scaled-up mockup */}
          <div className="relative z-10 w-full max-w-lg scale-110">
            <InventoryMockup />
          </div>
        </div>

        {/* Right Panel — Centered Form Container */}
        <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-12 bg-zinc-950">
          {children}
        </div>
      </main>
    </div>
  );
}
