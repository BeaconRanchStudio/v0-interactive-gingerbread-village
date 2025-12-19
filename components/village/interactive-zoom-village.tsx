"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Volume2, VolumeX } from "lucide-react"

type ZoomLevel = {
  id: string
  type: "image" | "video"
  src: string
  hotspots?: Hotspot[]
  loop?: boolean
}

type Hotspot = {
  id: string
  label: string
  x: number // percentage
  y: number // percentage
  width: number // percentage
  height: number // percentage
  transitionVideo?: string
  nextLevel: string
}

const zoomLevels: Record<string, ZoomLevel> = {
  village: {
    id: "village",
    type: "image",
    src: "/images/village.png",
    hotspots: [
      {
        id: "grandparents",
        label: "Grandparents' House",
        x: 35,
        y: 20,
        width: 25,
        height: 30,
        transitionVideo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/village%20to%20house%20row-7ab7Qc3mazhxQ9Ex6z7MNTmgwc9iMg.mp4",
        nextLevel: "houseRow",
      },
    ],
  },
  houseRow: {
    id: "houseRow",
    type: "image",
    src: "/images/house-row.png",
    hotspots: [
      {
        id: "mamawPapaw",
        label: "Mamaw & Papaw",
        x: 40,
        y: 30,
        width: 30,
        height: 40,
        transitionVideo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house%20row%20to%20mamaw%20and%20papaw-9KshEfp8tJAPNSuGxUHqZ38ODBlJZ4.mp4",
        nextLevel: "midFrameMamawPapaw",
      },
    ],
  },
  midFrameMamawPapaw: {
    id: "midFrameMamawPapaw",
    type: "image",
    src: "/images/mid-frame-mamaw-and-papaw.png",
    hotspots: [
      {
        id: "mamawPapawClose",
        label: "Get Closer",
        x: 25,
        y: 25,
        width: 50,
        height: 50,
        nextLevel: "mamawPapawVideo",
      },
    ],
  },
  mamawPapawVideo: {
    id: "mamawPapawVideo",
    type: "video",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zoom%20in%20on%20mamaw%20and%20papaw-1uNa7IYsgMRkwjWLMZS6YaLvzhB2PL.mp4",
    loop: true,
  },
}

export function InteractiveZoomVillage() {
  const [currentLevel, setCurrentLevel] = useState<string>("village")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [levelHistory, setLevelHistory] = useState<string[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const transitionVideoRef = useRef<HTMLVideoElement>(null)

  const currentZoomLevel = zoomLevels[currentLevel]

  useEffect(() => {
    if (currentZoomLevel.type === "video" && videoRef.current) {
      videoRef.current.muted = !soundEnabled
    }
  }, [soundEnabled, currentZoomLevel.type])

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isTransitioning) return

    setLevelHistory([...levelHistory, currentLevel])

    if (hotspot.transitionVideo) {
      setIsTransitioning(true)

      const transitionVideo = transitionVideoRef.current
      if (transitionVideo) {
        transitionVideo.src = hotspot.transitionVideo
        transitionVideo.muted = !soundEnabled
        transitionVideo.style.display = "block"
        transitionVideo.play()

        transitionVideo.onended = () => {
          setIsTransitioning(false)
          transitionVideo.style.display = "none"
          setCurrentLevel(hotspot.nextLevel)
        }
      }
    } else {
      setCurrentLevel(hotspot.nextLevel)
    }
  }

  const handleBack = () => {
    if (levelHistory.length === 0) return

    // Stop any playing video
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      videoRef.current.src = ""
    }

    const previousLevel = levelHistory[levelHistory.length - 1]
    setLevelHistory(levelHistory.slice(0, -1))
    setCurrentLevel(previousLevel)
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Main content */}
      <div className="relative w-full h-full">
        {currentZoomLevel.type === "image" ? (
          <div className="relative w-full h-full">
            <img
              src={currentZoomLevel.src || "/placeholder.svg"}
              alt="Gingerbread village"
              className="w-full h-full object-cover"
            />

            {/* Hotspots */}
            {currentZoomLevel.hotspots?.map((hotspot) => (
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
                aria-label={hotspot.label}
              >
                <div className="w-full h-full border-4 border-yellow-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-yellow-400/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white bg-black/80 px-3 py-1 rounded-full text-sm font-semibold">
                      {hotspot.label}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <video
            ref={videoRef}
            src={currentZoomLevel.src}
            className="w-full h-full object-cover"
            autoPlay
            loop={currentZoomLevel.loop}
            muted={!soundEnabled}
            playsInline
          />
        )}
      </div>

      {/* Transition video overlay */}
      <video
        ref={transitionVideoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: "none" }}
        playsInline
      />

      {/* Controls */}
      <div className="absolute top-4 left-4 flex gap-2">
        {levelHistory.length > 0 && (
          <Button onClick={handleBack} variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        )}
      </div>

      <div className="absolute top-4 right-4">
        <Button
          onClick={() => setSoundEnabled(!soundEnabled)}
          variant="secondary"
          size="sm"
          className="bg-white/90 hover:bg-white"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
