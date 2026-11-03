'use client'

import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import "./globals.css";
import { Button } from "@/components/tailgrids/core/button";
import { usePathname } from "next/navigation";
import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function UserBanner() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3.5 mt-2.5 mb-1 text-xs md:text-sm select-none">
      <div className="flex items-center gap-1.5 font-bold text-gray-900">
        <span>ROLE:</span>
        <span className="bg-red-50 text-red-500 font-bold px-2.5 py-0.5 rounded-full text-xs">
          {user.role}
        </span>
      </div>
      <div className="flex items-center gap-1.5 font-bold text-gray-900">
        <span>NAME:</span>
        <span className="bg-emerald-50 text-emerald-600 font-medium px-3 py-0.5 rounded-full text-xs">
          {user.name}
        </span>
      </div>
      <div className="flex items-center gap-1.5 font-bold text-gray-900">
        <span>EMAIL:</span>
        <span className="bg-gray-100 text-gray-600 font-medium px-3 py-0.5 rounded-full text-xs">
          {user.email}
        </span>
      </div>
    </div>
  );
}

function Navigation() {
  const pathname = usePathname();
  const { products, totalCount } = useCart();
  const { user, logout, openLoginModal } = useAuth();

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2.5 mt-3 mb-6">
      <Link href={"/"}>
        <Button appearance={pathname === '/' ? 'fill' : 'outline'} variant={"primary"} size={"sm"}>
          Home
        </Button>
      </Link>
      <Link href={"/animation"}>
        <Button appearance={pathname === '/animation' ? 'fill' : 'outline'} variant={"primary"} size={"sm"}>
          Animation
        </Button>
      </Link>
      <Link href={"/calculator"}>
        <Button appearance={pathname === '/calculator' ? 'fill' : 'outline'} variant={"primary"} size={"sm"}>
          Calculator
        </Button>
      </Link>
      <Link href={"/todos"}>
        <Button appearance={pathname === '/todos' ? 'fill' : 'outline'} variant={"primary"} size={"sm"}>
          Todos
        </Button>
      </Link>
      <Link href={"/products"}>
        <Button appearance={pathname === '/products' ? 'fill' : 'outline'} variant={"primary"} size={"sm"}>
          Products ({products.length})
        </Button>
      </Link>
      <Link href={"/carts"} className="relative inline-block">
        <Button appearance={pathname === '/carts' || pathname === '/cart' ? 'fill' : 'outline'} variant={"primary"} size={"sm"}>
          Carts
        </Button>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-bold rounded-full size-5 flex items-center justify-center shadow-md pointer-events-none">
          {totalCount}
        </span>
      </Link>

      {user ? (
        <button
          type="button"
          onClick={logout}
          className="border border-red-300 text-red-500 bg-red-50/40 hover:bg-red-100/60 active:scale-95 rounded-lg px-3.5 py-1.5 text-sm font-medium transition"
        >
          Logout
        </button>
      ) : (
        <button
          type="button"
          onClick={openLoginModal}
          className="border border-blue-400 text-blue-600 hover:bg-blue-50 active:scale-95 rounded-lg px-3.5 py-1.5 text-sm font-medium transition"
        >
          Login
        </button>
      )}
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <AuthProvider>
          <CartProvider>
            <Header />
            <UserBanner />
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
            <LoginModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
