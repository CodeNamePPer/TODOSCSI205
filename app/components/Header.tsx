'use client'
import { Badge } from "./components/tailgrids/core/badge"
export default function Header() {
    return (
        //header container
        <>
            {/* code */}
            <div className="flex justify-center gap-4">
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-red-300 text-white rotate-30" size="lg">C</Badge>
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-blue-300 text-white rotate-200" size="lg">S</Badge>
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-green-300 text-white rotate-20" size="lg">I</Badge>
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-yellow-300 text-white rotate-90" size="lg">2</Badge>
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-purple-300 text-white rotate-50" size="lg">0</Badge>
                <Badge className="text-3xl rounded-xl py-1 px-3 bg-pink-300 text-white rotate-30" size="lg">5</Badge>
            </div>
            {/* name */}
            <div className="mt-4">
                <div>
                    <Badge size="lg"></Badge>
                </div>
            </div>

        </>
    )
}