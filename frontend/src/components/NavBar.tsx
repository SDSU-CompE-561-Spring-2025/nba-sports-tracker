"use client";

import { useAuth } from "@/context/AuthContext";
import { ThemeSwitcherButton } from "@/components/ThemeSwitcherButton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import UserButton from "@/components/UserButton";
import { Home, LayoutDashboard, FolderOpen, Headphones } from "lucide-react";

const navList = [
  {
    label: "Home",
    link: "/",
    protected: true,
    icon: Home,
  },
  {
    label: "Dashboard",
    link: "/dashboard",
    protected: true,
    icon: LayoutDashboard,
  },
  {
    label: "File Path View All",
    link: "/file_path_view_all",
    icon: FolderOpen,
  },
  {
    label: "Listening Page",
    link: "/listening_page",
    protected: true,
    icon: Headphones,
  },
];

function NavBar() {
  const pathname = usePathname();
  const { token } = useAuth(); // Grab the JWT

  const filteredNavList = navList.filter((item) => !item.protected || token);

  if (!token) {
    return (
      <div className="w-full py-8 bg-background">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Link href="/" className="inline-flex items-center justify-center gap-3">
            <Image
              src="/logoAudioHub.png"
              alt="Audio Hub Logo"
              width={80}
              height={80}
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              The Audio Hub
            </h1>
          </Link>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste, manage and play your audio file paths in one place.
          </p>
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 mr-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logoAudioHub.png"
                alt="Audio Hub Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold hidden sm:inline-block">The Audio Hub</span>
            </Link>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {filteredNavList.map((item) => (
              <NavbarItem key={item.label} link={item.link} label={item.label} icon={item.icon} />
            ))}
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2">
            <ThemeSwitcherButton />
            <UserButton />
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-between">
            {filteredNavList.map((item) => (
              <MobileNavItem key={item.label} link={item.link} label={item.label} icon={item.icon} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

interface NavbarItemProps {
  link: string;
  label: string;
  icon?: React.ElementType;
  clickCallBack?: () => void;
}

function NavbarItem({ link, label, icon: Icon, clickCallBack }: NavbarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link
      href={link}
      className={cn(
        "relative px-3 py-2 text-sm font-medium transition-colors hover:text-foreground flex items-center gap-2 rounded-md",
        isActive ? "text-amber-500" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={() => {
        if (clickCallBack) clickCallBack();
      }}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
      {isActive && <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-amber-500" />}
    </Link>
  );
}

function MobileNavItem({ link, label, icon: Icon }: NavbarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link
      href={link}
      className={cn(
        "flex flex-col items-center justify-center py-2 px-1 text-xs",
        isActive ? "text-amber-500" : "text-muted-foreground"
      )}
    >
      {Icon && <Icon className="h-5 w-5 mb-1" />}
      <span className="max-w-[80px] truncate">{label}</span>
    </Link>
  );
}

export default NavBar;