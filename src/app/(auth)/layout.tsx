import Navbar from "@/components/navbar";
import InventoryMockup from "@/components/inventory-mockup";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col bg-gray-50 transition-colors duration-300 dark:bg-[#050510]">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[20%] top-[10%] h-[600px] w-[600px] rounded-full bg-indigo-300/30 blur-[120px] dark:bg-indigo-600/20" />
        <div className="absolute right-[10%] top-[30%] h-[500px] w-[500px] rounded-full bg-purple-300/20 blur-[120px] dark:bg-purple-600/15" />
        <div className="absolute bottom-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-blue-300/15 blur-[120px] dark:bg-blue-600/10" />
      </div>

      <Navbar />

      <main className="relative z-10 flex w-full flex-1 flex-col md:flex-row">
        {/* Side Panel A — Live Inventory Tracker (desktop only) */}
        <div className="hidden w-full items-center justify-center p-8 md:flex md:w-1/2 lg:p-12">
          <InventoryMockup />
        </div>

        {/* Side Panel B — Auth Forms */}
        <div className="flex w-full items-center justify-center px-4 py-12 md:w-1/2">
          {children}
        </div>
      </main>
    </div>
  );
}
