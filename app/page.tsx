"use client"

import { VillageCanvas } from "@/components/village/village-canvas"
import { VillageControls } from "@/components/village/village-controls"
import { useState } from "react"

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [snowIntensity, setSnowIntensity] = useState(1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-balance">The Gingerbread Village</h1>
          <p className="text-blue-200 text-lg">Click to explore the family holiday chaos!</p>
        </div>

        <VillageCanvas
          isPlaying={isPlaying}
          soundEnabled={soundEnabled}
          snowIntensity={snowIntensity}
          onPlayComplete={() => setIsPlaying(false)}
        />

        <VillageControls
          isPlaying={isPlaying}
          soundEnabled={soundEnabled}
          snowIntensity={snowIntensity}
          onPlayToggle={() => setIsPlaying(!isPlaying)}
          onSoundToggle={() => setSoundEnabled(!soundEnabled)}
          onSnowIntensityChange={setSnowIntensity}
        />
      </div>
    </div>
  )
}
