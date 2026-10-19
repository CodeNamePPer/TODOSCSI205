'use client'

import Link from "next/link";

import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import { Button } from "@/components/tailgrids/core/button";

import { usePathname } from "next/navigation";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  return (
    <html>
      <body>
        <Header />
        <nav className="flex flex-row justify-center gap-4 mt-4 bg-gray-200 rounded-xl py-1 px-2">
          <Link href={"/"}>
            <Button appearance={pathname === '/' ? 'fill' : 'outline'} variant={"primary"} size={"sm"}>
              Home
            </Button>
          </Link>
          <Link href={"/calculator"}>
            <Button appearance={pathname === '/calculator' ? 'fill' : 'outline'} variant={"primary"} size={"sm"}>
              Calculator
            </Button>
          </Link>
          <Link href={"/animation"}>
            <Button appearance={pathname === '/animation' ? 'fill' : 'outline'} variant={"primary"} size={"sm"}>
              Animation
            </Button>
          </Link>
          <Link href={"/todos"}>
            <Button appearance={pathname === '/todos' ? 'fill' : 'outline'} variant={"primary"} size={"sm"}>
              Todos
            </Button>
          </Link>
        </nav>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
