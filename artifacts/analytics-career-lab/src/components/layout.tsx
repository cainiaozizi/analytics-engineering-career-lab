import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, PenTool, MessageSquare, User, Menu, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/context/auth";

const navItems = [
  { name: "Home", path: "/", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: PenTool },
  { name: "Writings", path: "/writings", icon: FileText },
  { name: "Career", path: "/career", icon: MessageSquare },
  { name: "About", path: "/about", icon: User },
];

export function Sidebar() {
  const [location] = useLocation();
  const { isOwner } = useAuth();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.reload();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r bg-sidebar hidden flex-col lg:flex">
      <div className="flex h-14 items-center border-b px-6">
        <span className="font-semibold tracking-tight">Analytics Engineering Lab</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path} className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        {isOwner ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => { window.location.href = "/api/auth/google"; }}
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Button>
        )}
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const { isOwner } = useAuth();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.reload();
  }

  return (
    <div className="flex h-14 items-center border-b bg-background px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <div className="flex h-14 items-center border-b px-6">
            <span className="font-semibold tracking-tight">Career Lab</span>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => { setLocation(item.path); setOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          <div className="border-t p-4">
            {isOwner ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => { window.location.href = "/api/auth/google"; }}
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <span className="font-semibold ml-2">Career Lab</span>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background illustration */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-[0.18]"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen relative">
        <MobileNav />
        <main className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
        <footer className="border-t py-6 px-6 lg:px-8">
          <p className="text-xs text-muted-foreground text-center">© 2026 Zi Liu. All rights reserved.</p>
          <p className="text-xs text-muted-foreground text-center mt-2">Projects and examples are generalized or anonymized to protect confidential and proprietary information.</p>
        </footer>
      </div>
    </div>
  );
}
