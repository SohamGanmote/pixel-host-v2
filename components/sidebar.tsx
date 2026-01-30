"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Terminal,
  Menu,
  X,
  Server,
  Home,
  BookOpen,
  SlidersHorizontal,
  FolderTree,
  Cpu,
} from "lucide-react";

import logo from "@/public/logo-sm.png"
import name from "@/public/logo-txt.png"
import Image from "next/image";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const home: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "User Manual", href: "/manual", icon: BookOpen },
];

const defaultManagement: NavItem[] = [
  { name: "Servers", href: "/servers", icon: Server },
];

const serverManagement: NavItem[] = [
  { name: "Console", href: "/servers/[name]/console", icon: Terminal },
  { name: "Properties", href: "/servers/[name]/properties", icon: SlidersHorizontal },
];
const serverResources: NavItem[] = [
  { name: "Files", href: "/servers/[name]/files", icon: FolderTree },
  { name: "Memory", href: "/servers/[name]/memory", icon: Cpu }
];

export default function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const pathParts = pathname.split("/").filter(Boolean);
  const currentWorld = pathParts[1] || "";

  const isWorldPage = pathParts[0] === "servers" && pathParts.length >= 2;

  const navItems =
    isWorldPage ?
      serverManagement.map((item) => ({
        ...item,
        href: item.href.replace("[name]", currentWorld),
      }))
      : defaultManagement;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex h-full flex-col px-6 py-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6">
            <Image src={name} alt="name" className="w-fit h-10 cursor-pointer" onClick={() => router.push("/")} />
            <button className="lg:hidden" onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-6">
            <NavSection
              title="General"
              items={home}
              pathname={pathname}
              onClick={() => setOpen(false)}
            />
            <NavSection
              title="Management"
              items={navItems}
              pathname={pathname}
              onClick={() => setOpen(false)}
            />
            {isWorldPage &&
              <NavSection
                title="Resources"
                items={serverResources.map((item) => ({
                  ...item,
                  href: item.href.replace("[name]", currentWorld),
                }))}
                pathname={pathname}
                onClick={() => setOpen(false)}
              />
            }
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        <header className="flex lg:hidden items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <Image src={logo} alt="logo" className="w-10 h-10" />
          <Image src={name} alt="name" className="w-fit h-8" />
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu />
          </button>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </>
  );
}

/* ---------- Helpers ---------- */

function NavSection({
  title,
  items,
  pathname,
  onClick,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  onClick: () => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onClick}
                className={`flex items-center gap-3 rounded-md p-2 text-sm font-semibold
                  ${active
                    ? "bg-gray-100 text-primary"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
