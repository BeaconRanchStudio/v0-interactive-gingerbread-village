"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Snowflake } from "lucide-react"

interface VillageControlsProps {
  isPlaying: boolean
  soundEnabled: boolean
  snowIntensity: number
  onPlayToggle: () => void
  onSoundToggle: () => void
  onSnowIntensityChange: (value: number) => void
}

export function VillageControls({
  isPlaying,
  soundEnabled,
  snowIntensity,
  onPlayToggle,
  onSoundToggle,
  onSnowIntensityChange,
}: VillageControlsProps) {
  return (
    <Card className="mt-6 p-6 bg-white/90 backdrop-blur">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button onClick={onPlayToggle} size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause Story
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Play Story
              </>
            )}
          </Button>

          <Button onClick={onSoundToggle} variant="outline" size="icon" className="h-12 w-12 bg-transparent">
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Snowflake className="h-5 w-5 text-blue-500" />
          <div className="flex-1 md:w-48">
            <Slider
              value={[snowIntensity]}
              onValueChange={([value]) => onSnowIntensityChange(value)}
              min={0.1}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Snow: {Math.round(snowIntensity * 100)}%
          </span>
        </div>
      </div>

      <div className="mt-4 text-xs text-center text-muted-foreground">Made with love for your holiday video</div>
    </Card>
  )
}
