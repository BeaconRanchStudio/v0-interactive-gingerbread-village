"use client"

import { InteractiveZoomVillage } from "@/components/village/interactive-zoom-village"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-balance">The Gingerbread Village</h1>
          <p className="text-blue-200 text-lg">Click to explore the village!</p>
        </div>

        <InteractiveZoomVillage />
      </div>
    </div>
  )
}
