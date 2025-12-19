"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, VolumeX } from "lucide-react"

// Define zoom levels with their media
type ZoomLevel = {
  id: string
  image?: string
  video?: string
  isLooping?: boolean
  hotspots?: Hotspot[]
  title: string
}

type Hotspot = {
  id: string
  // Coordinates as percentages of image dimensions
  x: number // left position as %
  y: number // top position as %
  width: number // width as %
  height: number // height as %
  label: string
  nextLevel: string
  transitionVideo: string
}

// Define the zoom hierarchy
const zoomLevels: Record<string, ZoomLevel> = {
  village: {
    id: "village",
    image: "/images/village.png",
    title: "The Gingerbread Village",
    hotspots: [
      {
        id: "grandparents",
        x: 48,
        y: 20,
        width: 20,
        height: 25,
        label: "Visit Grandparents",
        nextLevel: "houseRow",
        transitionVideo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/village%20to%20house%20row-7ab7Qc3mazhxQ9Ex6z7MNTmgwc9iMg.mp4",
      },
    ],
  },
  houseRow: {
    id: "houseRow",
    image: "/images/house-row.png",
    title: "The House Row",
    hotspots: [
      {
        id: "grandparentsClose",
        x: 50,
        y: 20,
        width: 30,
        height: 35,
        label: "Mamaw & Papaw",
        nextLevel: "mamawPapawMid",
        transitionVideo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house%20row%20to%20mamaw%20and%20papaw-9KshEfp8tJAPNSuGxUHqZ38ODBlJZ4.mp4",
      },
    ],
  },
  mamawPapawMid: {
    id: "mamawPapawMid",
    image: "/images/mid-frame-mamaw-and-papaw.png",
    title: "Mamaw & Papaw's House",
    hotspots: [
      {
        id: "mamawPapawFinal",
        x: 35,
        y: 35,
        width: 30,
        height: 35,
        label: "Get Closer",
        nextLevel: "mamawPapawFinal",
        transitionVideo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zoom%20in%20on%20mamaw%20and%20papaw-1uNa7IYsgMRkwjWLMZS6YaLvzhB2PL.mp4",
      },
    ],
  },
  mamawPapawFinal: {
    id: "mamawPapawFinal",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zoom%20in%20on%20mamaw%20and%20papaw-1uNa7IYsgMRkwjWLMZS6YaLvzhB2PL.mp4",
    isLooping: true,
    title: "Mamaw & Papaw",
  },
}

export function InteractiveZoomVillage() {
  const [currentLevelId, setCurrentLevelId] = useState("village")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showHotspots, setShowHotspots] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [levelHistory, setLevelHistory] = useState<string[]>(["village"])

  const videoRef = useRef<HTMLVideoElement>(null)
  const transitionVideoRef = useRef<HTMLVideoElement>(null)

  const currentLevel = zoomLevels[currentLevelId]

  // Handle hotspot click
  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setShowHotspots(false)

    // Play transition video
    if (transitionVideoRef.current) {
      transitionVideoRef.current.src = hotspot.transitionVideo
      transitionVideoRef.current.muted = !soundEnabled
      transitionVideoRef.current.play()
    }
  }

  // Handle transition video end
  const handleTransitionEnd = () => {
    const transitionVideo = transitionVideoRef.current
    if (!transitionVideo) return

    // Find which hotspot was clicked by checking the video src
    const currentSrc = transitionVideo.src
    let nextLevelId = currentLevelId

    currentLevel.hotspots?.forEach((hotspot) => {
      if (currentSrc.includes(hotspot.transitionVideo.split("/").pop()!)) {
        nextLevelId = hotspot.nextLevel
      }
    })

    setCurrentLevelId(nextLevelId)
    setLevelHistory((prev) => [...prev, nextLevelId])
    setIsTransitioning(false)
    setShowHotspots(true)

    // If the next level is a looping video, start it
    const nextLevel = zoomLevels[nextLevelId]
    if (nextLevel.video && nextLevel.isLooping && videoRef.current) {
      videoRef.current.src = nextLevel.video
      videoRef.current.muted = !soundEnabled
      videoRef.current.loop = true
      videoRef.current.play()
    }
  }

  // Handle back button
  const handleBack = () => {
    if (levelHistory.length <= 1) return

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      videoRef.current.src = ""
    }
    if (transitionVideoRef.current) {
      transitionVideoRef.current.pause()
      transitionVideoRef.current.currentTime = 0
    }

    const newHistory = [...levelHistory]
    newHistory.pop() // Remove current level
    const previousLevelId = newHistory[newHistory.length - 1]

    setLevelHistory(newHistory)
    setCurrentLevelId(previousLevelId)
    setShowHotspots(true)
    setIsTransitioning(false)
  }

  // Update video sound when sound toggle changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !soundEnabled
    }
    if (transitionVideoRef.current) {
      transitionVideoRef.current.muted = !soundEnabled
    }
  }, [soundEnabled])

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-balance">{currentLevel.title}</h1>
        <p className="text-slate-300 text-lg">
          {currentLevel.hotspots ? "Click on areas to zoom in and explore" : "Enjoying the view"}
        </p>
      </div>

      {/* Main viewing area */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
        {/* Static image display */}
        {currentLevel.image && !isTransitioning && (
          <div className="relative w-full h-full">
            <img
              src={currentLevel.image || "/placeholder.svg"}
              alt={currentLevel.title}
              className="w-full h-full object-contain"
            />

            {/* Hotspot overlays */}
            {showHotspots &&
              currentLevel.hotspots?.map((hotspot) => (
                <button
                  key={hotspot.id}
                  onClick={() => handleHotspotClick(hotspot)}
                  className="absolute group cursor-pointer"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    width: `${hotspot.width}%`,
                    height: `${hotspot.height}%`,
                  }}
                >
                  {/* Hotspot highlight */}
                  <div className="absolute inset-0 bg-amber-400/20 border-2 border-amber-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />

                  {/* Label */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shadow-lg">
                      {hotspot.label}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        )}

        {/* Looping video display (final zoom level) */}
        {currentLevel.video && currentLevel.isLooping && !isTransitioning && (
          <video ref={videoRef} className="w-full h-full object-contain" loop muted={!soundEnabled} playsInline />
        )}

        {/* Transition video (plays during zoom transitions) */}
        {isTransitioning && (
          <video
            ref={transitionVideoRef}
            className="w-full h-full object-contain"
            onEnded={handleTransitionEnd}
            playsInline
          />
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <Button
          onClick={handleBack}
          disabled={levelHistory.length <= 1 || isTransitioning}
          variant="secondary"
          size="lg"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" size="lg" className="gap-2">
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4" />
                Sound On
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                Sound Off
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-slate-400 text-sm">
        <p>Hover over highlighted areas to see what you can explore</p>
      </div>
    </div>
  )
}
