'use client'
import { Badge } from "./components/tailgrids/core/badge"

export default function Header() {
    return (
        <header className="pt-4 pb-2">
            {/* code */}
            <div className="flex justify-center gap-4">
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-red-400 text-white rotate-30 font-bold" size="lg">C</Badge>
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-green-400 text-white rotate-200 font-bold" size="lg">S</Badge>
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-blue-400 text-white rotate-20 font-bold" size="lg">I</Badge>
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-cyan-400 text-white rotate-90 font-bold" size="lg">2</Badge>
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-amber-400 text-white rotate-50 font-bold" size="lg">0</Badge>
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-gray-500 text-white rotate-30 font-bold" size="lg">5</Badge>
            </div>
            {/* name */}
            <div className="flex justify-center mt-3">
                <span className="bg-black text-white text-xs md:text-sm font-bold tracking-wider px-4 py-1.5 rounded-md shadow-sm">
                    FRONT END SOFTWARE DEVELOPMENT
                </span>
            </div>
        </header>
    )
}
