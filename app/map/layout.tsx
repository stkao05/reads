import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Toaster />
      <main>{children}</main>
    </div>
  );
}
