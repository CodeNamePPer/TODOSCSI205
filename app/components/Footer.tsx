'use client'
import Link from "next/link";
import { Badge } from "./components/tailgrids/core/badge"
import { Facebook, Instagram, Twitter } from "@tailgrids/icons";
export default function Footer() {
    return (
        <>
            <div className="text-center mb-4 text-xl font-bold">68094495 อิทธิวรรธน์ ขุนพิชัย</div>
            <div className="flex flex-col">
                {/* student */}
                <div>
                    <Badge className="text-xl text-black"></Badge>
                </div>
                {/* contacts */}
                <div className="flex justify-center gap-6 mt-4">
                    <Link href="https://www.facebook.com/" target="_blank"><Facebook className="text-blue-700" /></Link>
                    <div className="border-l-1 h-8 border-gray-700 "></div>
                    <Link href="https://x.com/" target="_blank"><Twitter className="text-black" /></Link>
                </div>
            </div>

        </>
    )
}