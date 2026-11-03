'use client'
import Link from "next/link";
import { Facebook } from "@tailgrids/icons";

export default function Footer() {
    return (
        <footer className="mt-12 mb-8 flex flex-col items-center">
            {/* student */}
            <div className="mb-3">
                <span className="inline-block bg-[#dbeafe] text-[#1e40af] font-bold px-4 py-1.5 rounded-lg text-sm shadow-sm">
                    68094495 อิทธิวรรธน์ ขุนพิชัย
                </span>
            </div>
            {/* contacts */}
            <div className="flex items-center gap-4">
                <Link href="https://www.facebook.com/" target="_blank" aria-label="Facebook">
                    <Facebook className="text-blue-700 size-5 hover:opacity-80 transition" />
                </Link>
                <div className="border-l border-gray-400 h-4"></div>
                <Link href="https://www.youtube.com/" target="_blank" aria-label="YouTube">
                    <svg className="size-5 fill-red-600 hover:opacity-80 transition" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                </Link>
            </div>
        </footer>
    );
}
