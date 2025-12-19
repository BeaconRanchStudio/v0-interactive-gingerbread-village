"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Share2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface VillageCanvasProps {
  isPlaying: boolean
  soundEnabled: boolean
  snowIntensity: number
  onPlayComplete: () => void
}

interface AnimationState {
  dadFalling: boolean
  dadTangledLights: boolean
  dogChasing: boolean
  snowballFight: boolean
  iceSkatersSlip: boolean
  sleddingWipeout: boolean
  carolersSinging: boolean
  carolersKnocking: boolean
  gossipFence: boolean
  marshmallowRoast: boolean
  mailmanDelivering: boolean
  mistletoeKiss: boolean
  kidEatingHouse: boolean
  choppingWood: boolean
  hotCocoaStand: boolean
  decoratingTree: boolean
  santaStuckChimney: boolean
  catInTree: boolean
  proposal: boolean
}

export function VillageCanvas({ isPlaying, soundEnabled, snowIntensity, onPlayComplete }: VillageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const [hasStarted, setHasStarted] = useState(false)
  const [showReplay, setShowReplay] = useState(false)
  const snowParticlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number }>>([])
  const dogPositionRef = useRef({ x: 0, y: 0, angle: 0, progress: 0 })
  const [animationState, setAnimationState] = useState<AnimationState>({
    dadFalling: false,
    dadTangledLights: false,
    dogChasing: false,
    snowballFight: false,
    iceSkatersSlip: false,
    sleddingWipeout: false,
    carolersSinging: false,
    carolersKnocking: false,
    gossipFence: false,
    marshmallowRoast: false,
    mailmanDelivering: false,
    mistletoeKiss: false,
    kidEatingHouse: false,
    choppingWood: false,
    hotCocoaStand: false,
    decoratingTree: false,
    santaStuckChimney: false,
    catInTree: false,
    proposal: false,
  })

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Interactive Gingerbread Village",
        text: "Check out this fun interactive gingerbread village!",
        url: window.location.href,
      })
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Initialize snow particles
    if (snowParticlesRef.current.length === 0) {
      for (let i = 0; i < 100 * snowIntensity; i++) {
        snowParticlesRef.current.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random() * 1 + 0.5,
          size: Math.random() * 3 + 1,
        })
      }
    }

    const drawGingerbreadTexture = (x: number, y: number, width: number, height: number) => {
      const gradient = ctx.createLinearGradient(x, y, x, y + height)
      gradient.addColorStop(0, "#A0724E")
      gradient.addColorStop(0.5, "#8B6444")
      gradient.addColorStop(1, "#6E4F3A")
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, width, height)

      // Add gingerbread texture
      ctx.fillStyle = "rgba(110, 79, 58, 0.3)"
      for (let i = 0; i < 20; i++) {
        const tx = x + Math.random() * width
        const ty = y + Math.random() * height
        ctx.fillRect(tx, ty, 2, 2)
      }
    }

    const drawIcingDecoration = (x: number, y: number, pattern = "waves") => {
      ctx.strokeStyle = "#F0E6D2"
      ctx.lineWidth = 3
      ctx.lineCap = "round"

      if (pattern === "waves") {
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          ctx.arc(x + i * 8, y, 4, 0, Math.PI, true)
        }
        ctx.stroke()
      } else if (pattern === "dots") {
        for (let i = 0; i < 5; i++) {
          ctx.beginPath()
          ctx.arc(x + i * 8, y, 2, 0, Math.PI * 2)
          ctx.fillStyle = "#F0E6D2"
          ctx.fill()
        }
      }
    }

    const drawHouse = (x: number, y: number, width: number, height: number, label: string, features?: () => void) => {
      // House body
      drawGingerbreadTexture(x, y, width, height)

      // Roof
      ctx.fillStyle = "#6E4F3A"
      ctx.beginPath()
      ctx.moveTo(x - 10, y)
      ctx.lineTo(x + width / 2, y - 40)
      ctx.lineTo(x + width + 10, y)
      ctx.closePath()
      ctx.fill()

      // Icing on roof edges
      drawIcingDecoration(x, y, "waves")

      // Door
      ctx.fillStyle = "#5A3825"
      ctx.fillRect(x + width / 2 - 15, y + height - 35, 30, 35)

      // Window
      ctx.fillStyle = "#FFE5B4"
      ctx.fillRect(x + 15, y + 20, 25, 25)
      ctx.strokeStyle = "#6E4F3A"
      ctx.lineWidth = 2
      ctx.strokeRect(x + 15, y + 20, 25, 25)

      // Window cross
      ctx.beginPath()
      ctx.moveTo(x + 27.5, y + 20)
      ctx.lineTo(x + 27.5, y + 45)
      ctx.moveTo(x + 15, y + 32.5)
      ctx.lineTo(x + 40, y + 32.5)
      ctx.stroke()

      // Decorations
      if (features) features()

      // Label
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, x + width / 2, y + height + 15)
    }

    const drawCharacter = (x: number, y: number, scale = 1, pose = "standing") => {
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(scale, scale)

      // Body
      ctx.fillStyle = "#A0724E"
      ctx.beginPath()
      ctx.arc(0, 0, 8, 0, Math.PI * 2)
      ctx.fill()

      // Head
      ctx.beginPath()
      ctx.arc(0, -12, 6, 0, Math.PI * 2)
      ctx.fill()

      // Icing details
      ctx.fillStyle = "#F0E6D2"
      ctx.beginPath()
      ctx.arc(-2, -12, 1.5, 0, Math.PI * 2)
      ctx.arc(2, -12, 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Arms and legs based on pose
      ctx.strokeStyle = "#A0724E"
      ctx.lineWidth = 3
      ctx.lineCap = "round"

      if (pose === "falling") {
        ctx.beginPath()
        ctx.moveTo(-8, -2)
        ctx.lineTo(-15, -8)
        ctx.moveTo(8, -2)
        ctx.lineTo(15, -8)
        ctx.stroke()
      } else if (pose === "throwing") {
        ctx.beginPath()
        ctx.moveTo(-8, -2)
        ctx.lineTo(-12, -12)
        ctx.moveTo(8, -2)
        ctx.lineTo(15, 5)
        ctx.stroke()
      } else if (pose === "singing") {
        // Arms out wide for singing
        ctx.beginPath()
        ctx.moveTo(-8, -2)
        ctx.lineTo(-15, 0)
        ctx.moveTo(8, -2)
        ctx.lineTo(15, 0)
        ctx.stroke()
        // Open mouth
        ctx.fillStyle = "#5A3825"
        ctx.beginPath()
        ctx.arc(0, -10, 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (pose === "running") {
        ctx.beginPath()
        ctx.moveTo(-8, -2)
        ctx.lineTo(-15, -5)
        ctx.moveTo(8, -2)
        ctx.lineTo(12, 8)
        ctx.stroke()
      } else if (pose === "kissing") {
        ctx.beginPath()
        ctx.moveTo(-8, -2)
        ctx.lineTo(-10, 2)
        ctx.moveTo(8, -2)
        ctx.lineTo(10, 2)
        ctx.stroke()
      } else if (pose === "shocked") {
        ctx.beginPath()
        ctx.moveTo(-8, -2)
        ctx.lineTo(-15, -10)
        ctx.moveTo(8, -2)
        ctx.lineTo(15, -10)
        ctx.stroke()
      } else if (pose === "chopping") {
        ctx.beginPath()
        ctx.moveTo(-8, -2)
        ctx.lineTo(-5, -15)
        ctx.moveTo(8, -2)
        ctx.lineTo(5, -15)
        ctx.stroke()
      } else if (pose === "carrying") {
        ctx.beginPath()
        ctx.moveTo(-8, -2)
        ctx.lineTo(-12, 0)
        ctx.moveTo(8, -2)
        ctx.lineTo(12, 0)
        ctx.stroke()
      } else if (pose === "kneeling") {
        // Special kneeling pose for proposal
        ctx.beginPath()
        ctx.moveTo(-8, -2)
        ctx.lineTo(-12, 5)
        ctx.moveTo(8, -2)
        ctx.lineTo(12, 5)
        ctx.stroke()
        // Only one leg visible
        ctx.beginPath()
        ctx.moveTo(-3, 8)
        ctx.lineTo(-8, 15)
        ctx.stroke()
        ctx.restore()
        return
      } else {
        ctx.beginPath()
        ctx.moveTo(-8, -2)
        ctx.lineTo(-12, 5)
        ctx.moveTo(8, -2)
        ctx.lineTo(12, 5)
        ctx.stroke()
      }

      // Legs
      ctx.beginPath()
      ctx.moveTo(-3, 8)
      ctx.lineTo(-5, 18)
      ctx.moveTo(3, 8)
      ctx.lineTo(5, 18)
      ctx.stroke()

      ctx.restore()
    }

    const drawTree = (x: number, y: number, size: number) => {
      // Tree trunk
      ctx.fillStyle = "#6E4F3A"
      ctx.fillRect(x - 5, y, 10, 20)

      // Tree triangles
      ctx.fillStyle = "#2C5530"
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(x - 20 + i * 5, y - i * 15)
        ctx.lineTo(x, y - 25 - i * 15)
        ctx.lineTo(x + 20 - i * 5, y - i * 15)
        ctx.closePath()
        ctx.fill()
      }

      // Ornaments
      const colors = ["#B8313A", "#FFD700", "#4169E1"]
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = colors[i % colors.length]
        ctx.beginPath()
        ctx.arc(x + (Math.random() - 0.5) * 30, y - 10 - Math.random() * 50, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Star on top
      ctx.fillStyle = "#FFD700"
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
        const r = i % 2 === 0 ? 8 : 4
        const px = x + Math.cos(angle) * r
        const py = y - 70 + Math.sin(angle) * r
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
    }

    const drawPond = (x: number, y: number, width: number, height: number) => {
      // Ice surface
      const gradient = ctx.createRadialGradient(
        x + width / 2,
        y + height / 2,
        0,
        x + width / 2,
        y + height / 2,
        width / 2,
      )
      gradient.addColorStop(0, "#D5E8F0")
      gradient.addColorStop(1, "#B8DDE6")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Ice shine
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x + width / 2 - 20, y + height / 2 - 10, 30, 0.2, 1.5)
      ctx.stroke()
    }

    const drawFirepit = (x: number, y: number) => {
      // Stone ring
      ctx.fillStyle = "#666666"
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8
        const rx = x + Math.cos(angle) * 25
        const ry = y + Math.sin(angle) * 25
        ctx.fillRect(rx - 5, ry - 5, 10, 10)
      }

      // Fire
      const time = Date.now() / 100
      for (let i = 0; i < 3; i++) {
        const flicker = Math.sin(time + i) * 5
        ctx.fillStyle = i === 0 ? "#FF6B35" : i === 1 ? "#FF8C42" : "#FFD700"
        ctx.beginPath()
        ctx.moveTo(x - 10 + i * 10, y)
        ctx.quadraticCurveTo(x - 5 + i * 10, y - 20 + flicker, x + i * 10, y - 30 + flicker)
        ctx.quadraticCurveTo(x + 5 + i * 10, y - 20 + flicker, x + 10 + i * 10, y)
        ctx.closePath()
        ctx.fill()
      }
    }

    const drawSnowfort = (x: number, y: number) => {
      // Fort walls
      ctx.fillStyle = "#FFFAFA"
      ctx.fillRect(x - 40, y - 20, 15, 30)
      ctx.fillRect(x + 25, y - 20, 15, 30)
      ctx.fillRect(x - 25, y - 15, 50, 20)

      // Snow texture
      ctx.fillStyle = "rgba(200, 220, 240, 0.5)"
      for (let i = 0; i < 30; i++) {
        ctx.fillRect(x - 40 + Math.random() * 80, y - 20 + Math.random() * 30, 2, 2)
      }
    }

    const drawDogChasePath = () => {
      if (!animationState.dogChasing) return

      const path = [
        { x: 50, y: 400 },
        { x: 150, y: 350 },
        { x: 250, y: 380 },
        { x: 350, y: 340 },
        { x: 450, y: 370 },
        { x: 550, y: 350 },
        { x: 650, y: 380 },
      ]

      // Dotted path
      ctx.strokeStyle = "rgba(139, 100, 68, 0.4)"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 10])
      ctx.beginPath()
      ctx.moveTo(path[0].x, path[0].y)
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y)
      }
      ctx.stroke()
      ctx.setLineDash([])

      // Animate dog
      const progress = dogPositionRef.current.progress
      const totalSegments = path.length - 1
      const segmentIndex = Math.floor(progress * totalSegments)
      const segmentProgress = (progress * totalSegments) % 1

      if (segmentIndex < totalSegments) {
        const start = path[segmentIndex]
        const end = path[segmentIndex + 1]
        const x = start.x + (end.x - start.x) * segmentProgress
        const y = start.y + (end.y - start.y) * segmentProgress

        // Draw dog
        ctx.save()
        ctx.translate(x, y)
        ctx.fillStyle = "#8B6444"
        ctx.beginPath()
        ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2)
        ctx.fill()

        // Dog ears
        ctx.beginPath()
        ctx.ellipse(-8, -5, 4, 6, -0.3, 0, Math.PI * 2)
        ctx.ellipse(8, -5, 4, 6, 0.3, 0, Math.PI * 2)
        ctx.fill()

        // Tail
        ctx.strokeStyle = "#8B6444"
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(10, 0, 8, -Math.PI / 4, Math.PI / 4)
        ctx.stroke()

        ctx.restore()

        dogPositionRef.current.progress += 0.005
        if (dogPositionRef.current.progress >= 1) {
          dogPositionRef.current.progress = 0
        }
      }
    }

    const drawSnow = () => {
      const particles = snowParticlesRef.current
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"

      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.y > rect.height) {
          particle.y = 0
          particle.x = Math.random() * rect.width
        }
        if (particle.x < 0) particle.x = rect.width
        if (particle.x > rect.width) particle.x = 0
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, rect.height)
      skyGradient.addColorStop(0, "#4A5A7A")
      skyGradient.addColorStop(1, "#6B7B9B")
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Ground (snow)
      ctx.fillStyle = "#FFFAFA"
      ctx.fillRect(0, rect.height - 150, rect.width, 150)

      // Back layer - houses
      drawHouse(100, 150, 120, 100, "Main House", () => {
        // Dad on roof
        if (animationState.dadFalling) {
          drawCharacter(160, 120, 0.8, "falling")
        } else {
          drawCharacter(160, 135, 0.8, "standing")
        }

        // Christmas lights on roof
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle = i % 2 === 0 ? "#B8313A" : "#FFD700"
          ctx.beginPath()
          ctx.arc(110 + i * 12, 150, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      drawHouse(300, 170, 100, 90, "Grandparents", () => {
        // Porch
        ctx.fillStyle = "#8B6444"
        ctx.fillRect(290, 260, 120, 10)

        // Gossip neighbors
        if (animationState.gossipFence) {
          drawCharacter(370, 240, 0.7, "standing")
          drawCharacter(420, 240, 0.7, "standing")

          // Speech bubbles
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
          ctx.beginPath()
          ctx.arc(380, 215, 15, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(430, 215, 15, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = "#000000"
          ctx.font = "10px sans-serif"
          ctx.fillText("...", 375, 218)
          ctx.fillText("...", 425, 218)
        }
      })

      drawHouse(500, 180, 110, 95, "Kids' Cottage", () => {
        // Bite taken out
        ctx.fillStyle = "#6B7B9B"
        ctx.beginPath()
        ctx.arc(560, 200, 25, 0, Math.PI * 2)
        ctx.fill()
      })

      // Mid layer - attractions
      drawTree(350, rect.height - 200, 1)

      drawPond(150, rect.height - 280, 140, 80)
      // Ice skaters
      if (animationState.iceSkatersSlip) {
        drawCharacter(200, rect.height - 250, 0.9, "falling")
        drawCharacter(240, rect.height - 240, 0.9, "standing")
      } else {
        drawCharacter(200, rect.height - 250, 0.9, "standing")
        drawCharacter(240, rect.height - 240, 0.9, "standing")
      }

      // Sledding hill
      ctx.fillStyle = "#FFFAFA"
      ctx.beginPath()
      ctx.moveTo(450, rect.height - 300)
      ctx.quadraticCurveTo(500, rect.height - 250, 550, rect.height - 150)
      ctx.lineTo(550, rect.height - 150)
      ctx.lineTo(450, rect.height - 150)
      ctx.closePath()
      ctx.fill()

      if (animationState.sleddingWipeout) {
        drawCharacter(520, rect.height - 180, 1, "falling")
        // Sled
        ctx.fillStyle = "#B8313A"
        ctx.fillRect(530, rect.height - 170, 30, 8)
      }

      // Front layer
      drawFirepit(620, rect.height - 180)

      // Log seats
      ctx.fillStyle = "#6E4F3A"
      ctx.fillRect(580, rect.height - 160, 40, 10)
      ctx.fillRect(640, rect.height - 160, 40, 10)

      if (animationState.marshmallowRoast) {
        drawCharacter(600, rect.height - 175, 1, "standing")
        // Marshmallow stick
        ctx.strokeStyle = "#6E4F3A"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(600, rect.height - 175)
        ctx.lineTo(620, rect.height - 185)
        ctx.stroke()

        // Marshmallow
        ctx.fillStyle = "#FFFAFA"
        ctx.beginPath()
        ctx.arc(622, rect.height - 186, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      drawSnowfort(80, rect.height - 180)

      if (animationState.snowballFight) {
        drawCharacter(60, rect.height - 200, 0.9, "throwing")
        drawCharacter(100, rect.height - 195, 0.9, "standing")

        // Snowball in air
        ctx.fillStyle = "#FFFAFA"
        ctx.beginPath()
        ctx.arc(80, rect.height - 220, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Dog chase path
      drawDogChasePath()

      // Carolers singing near the tree
      if (animationState.carolersSinging) {
        drawCharacter(320, rect.height - 170, 0.7, "singing")
        drawCharacter(335, rect.height - 175, 0.7, "singing")
        drawCharacter(350, rect.height - 168, 0.7, "singing")
        // Songbooks
        ctx.fillStyle = "#FFFAFA"
        ctx.fillRect(318, rect.height - 165, 8, 10)
        ctx.fillRect(333, rect.height - 170, 8, 10)
        ctx.fillRect(348, rect.height - 163, 8, 10)
        // Musical notes
        ctx.fillStyle = "#333"
        ctx.font = "12px serif"
        ctx.fillText("♪", 340, rect.height - 190)
        ctx.fillText("♫", 355, rect.height - 195)
      }

      // Mailman delivering packages
      if (animationState.mailmanDelivering) {
        drawCharacter(270, rect.height - 165, 0.8, "carrying")
        // Packages
        ctx.fillStyle = "#B8313A"
        ctx.fillRect(275, rect.height - 160, 12, 10)
        ctx.fillStyle = "#228B22"
        ctx.fillRect(260, rect.height - 155, 10, 8)
        // Ribbon
        ctx.strokeStyle = "#FFD700"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(275, rect.height - 155)
        ctx.lineTo(287, rect.height - 155)
        ctx.moveTo(281, rect.height - 160)
        ctx.lineTo(281, rect.height - 150)
        ctx.stroke()
      }

      // Mistletoe kiss scene
      if (animationState.mistletoeKiss) {
        // Mistletoe
        ctx.fillStyle = "#228B22"
        ctx.beginPath()
        ctx.arc(165, 245, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#FF0000"
        ctx.beginPath()
        ctx.arc(163, 248, 2, 0, Math.PI * 2)
        ctx.arc(167, 248, 2, 0, Math.PI * 2)
        ctx.fill()
        // Characters kissing
        drawCharacter(155, 270, 0.7, "kissing")
        drawCharacter(175, 270, 0.7, "kissing")
        // Kid going "eww"
        drawCharacter(195, 275, 0.5, "shocked")
        ctx.fillStyle = "#FFF"
        ctx.font = "8px sans-serif"
        ctx.fillText("EWW!", 190, 260)
      }

      // Hot cocoa stand
      if (animationState.hotCocoaStand) {
        // Table
        ctx.fillStyle = "#A0724E"
        ctx.fillRect(680, rect.height - 170, 50, 5)
        // Table legs
        ctx.fillRect(685, rect.height - 165, 5, 15)
        ctx.fillRect(720, rect.height - 165, 5, 15)
        // Cups
        ctx.fillStyle = "#FFFAFA"
        ctx.fillRect(690, rect.height - 180, 8, 10)
        ctx.fillRect(705, rect.height - 180, 8, 10)
        ctx.fillRect(718, rect.height - 180, 8, 10)
        // Steam
        ctx.strokeStyle = "rgba(255,255,255,0.5)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(694, rect.height - 182)
        ctx.quadraticCurveTo(696, rect.height - 190, 694, rect.height - 195)
        ctx.stroke()
        // Kid running stand
        drawCharacter(735, rect.height - 175, 0.6, "standing")
        // Sign
        ctx.fillStyle = "#8B4513"
        ctx.fillRect(740, rect.height - 200, 30, 20)
        ctx.fillStyle = "#FFF"
        ctx.font = "6px sans-serif"
        ctx.fillText("HOT", 745, rect.height - 192)
        ctx.fillText("COCOA", 743, rect.height - 185)
      }

      // Chopping wood scene
      if (animationState.choppingWood) {
        // Log pile
        ctx.fillStyle = "#6E4F3A"
        for (let i = 0; i < 4; i++) {
          ctx.beginPath()
          ctx.ellipse(35 + i * 8, rect.height - 140 + i * 3, 8, 4, 0, 0, Math.PI * 2)
          ctx.fill()
        }
        // Person chopping
        drawCharacter(55, rect.height - 165, 0.9, "chopping")
        // Axe
        ctx.strokeStyle = "#6E4F3A"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(55, rect.height - 180)
        ctx.lineTo(55, rect.height - 200)
        ctx.stroke()
        ctx.fillStyle = "#888"
        ctx.beginPath()
        ctx.moveTo(50, rect.height - 200)
        ctx.lineTo(60, rect.height - 200)
        ctx.lineTo(55, rect.height - 210)
        ctx.closePath()
        ctx.fill()
      }

      // Santa stuck in chimney
      if (animationState.santaStuckChimney) {
        // Legs sticking out
        ctx.strokeStyle = "#B8313A"
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(160, 115)
        ctx.lineTo(155, 95)
        ctx.moveTo(170, 115)
        ctx.lineTo(175, 95)
        ctx.stroke()
        // Black boots
        ctx.fillStyle = "#000"
        ctx.beginPath()
        ctx.ellipse(155, 92, 5, 3, 0, 0, Math.PI * 2)
        ctx.ellipse(175, 92, 5, 3, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // Cat in tree
      if (animationState.catInTree) {
        // Cat body
        ctx.fillStyle = "#FF8C00"
        ctx.beginPath()
        ctx.ellipse(360, rect.height - 235, 6, 4, 0, 0, Math.PI * 2)
        ctx.fill()
        // Cat head
        ctx.beginPath()
        ctx.arc(355, rect.height - 238, 4, 0, Math.PI * 2)
        ctx.fill()
        // Ears
        ctx.beginPath()
        ctx.moveTo(352, rect.height - 242)
        ctx.lineTo(350, rect.height - 248)
        ctx.lineTo(354, rect.height - 244)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(358, rect.height - 242)
        ctx.lineTo(360, rect.height - 248)
        ctx.lineTo(356, rect.height - 244)
        ctx.fill()
        // Tail
        ctx.strokeStyle = "#FF8C00"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(368, rect.height - 235, 6, Math.PI, Math.PI * 1.5)
        ctx.stroke()
      }

      // Proposal scene
      if (animationState.proposal) {
        drawCharacter(430, 255, 0.8, "kneeling")
        drawCharacter(450, 245, 0.8, "shocked")
        // Ring
        ctx.fillStyle = "#FFD700"
        ctx.beginPath()
        ctx.arc(435, 252, 3, 0, Math.PI * 2)
        ctx.fill()
        // Heart
        ctx.fillStyle = "#FF69B4"
        ctx.font = "14px sans-serif"
        ctx.fillText("❤", 440, 225)
      }

      // Decorating tree scene
      if (animationState.decoratingTree) {
        // Ladder
        ctx.strokeStyle = "#8B4513"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(370, rect.height - 150)
        ctx.lineTo(365, rect.height - 220)
        ctx.moveTo(380, rect.height - 150)
        ctx.lineTo(375, rect.height - 220)
        for (let i = 0; i < 5; i++) {
          ctx.moveTo(370 - i * 1, rect.height - 160 - i * 14)
          ctx.lineTo(380 - i * 1, rect.height - 160 - i * 14)
        }
        ctx.stroke()
        // Person on ladder
        drawCharacter(372, rect.height - 210, 0.7, "standing")
        // Person handing ornament
        drawCharacter(390, rect.height - 165, 0.7, "standing")
        // Ornament being passed
        ctx.fillStyle = "#B8313A"
        ctx.beginPath()
        ctx.arc(385, rect.height - 180, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Snow particles
      drawSnow()

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animationState, snowIntensity, isPlaying])

  // Handle story sequence
  useEffect(() => {
    if (!isPlaying) return

    const sequence = [
      { delay: 0, action: () => setAnimationState((prev) => ({ ...prev, dogChasing: true })) },
      { delay: 2000, action: () => setAnimationState((prev) => ({ ...prev, dadFalling: true })) },
      { delay: 4000, action: () => setAnimationState((prev) => ({ ...prev, gossipFence: true })) },
      { delay: 6000, action: () => setAnimationState((prev) => ({ ...prev, snowballFight: true })) },
      { delay: 8000, action: () => setAnimationState((prev) => ({ ...prev, iceSkatersSlip: true })) },
      { delay: 10000, action: () => setAnimationState((prev) => ({ ...prev, sleddingWipeout: true })) },
      { delay: 12000, action: () => setAnimationState((prev) => ({ ...prev, marshmallowRoast: true })) },
      { delay: 14000, action: () => setAnimationState((prev) => ({ ...prev, carolersSinging: true })) },
      { delay: 16000, action: () => setAnimationState((prev) => ({ ...prev, mailmanDelivering: true })) },
      { delay: 18000, action: () => setAnimationState((prev) => ({ ...prev, mistletoeKiss: true })) },
      { delay: 20000, action: () => setAnimationState((prev) => ({ ...prev, choppingWood: true })) },
      { delay: 22000, action: () => setAnimationState((prev) => ({ ...prev, hotCocoaStand: true })) },
      { delay: 24000, action: () => setAnimationState((prev) => ({ ...prev, decoratingTree: true })) },
      { delay: 26000, action: () => setAnimationState((prev) => ({ ...prev, santaStuckChimney: true })) },
      { delay: 28000, action: () => setAnimationState((prev) => ({ ...prev, catInTree: true })) },
      { delay: 30000, action: () => setAnimationState((prev) => ({ ...prev, proposal: true })) },
      {
        delay: 32000,
        action: () => {
          setShowReplay(true)
          onPlayComplete()
        },
      },
    ]

    const timeouts = sequence.map(({ delay, action }) => setTimeout(action, delay))

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [isPlaying, onPlayComplete])

  const handleStart = () => {
    setHasStarted(true)
    setShowReplay(false)
    setAnimationState({
      dadFalling: false,
      dadTangledLights: false,
      dogChasing: false,
      snowballFight: false,
      iceSkatersSlip: false,
      sleddingWipeout: false,
      carolersSinging: false,
      carolersKnocking: false,
      gossipFence: false,
      marshmallowRoast: false,
      mailmanDelivering: false,
      mistletoeKiss: false,
      kidEatingHouse: false,
      choppingWood: false,
      hotCocoaStand: false,
      decoratingTree: false,
      santaStuckChimney: false,
      catInTree: false,
      proposal: false,
    })
  }

  const handleClickCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Click detection for different areas
    if (x > 100 && x < 220 && y > 150 && y < 250) {
      setAnimationState((prev) => ({ ...prev, dadFalling: !prev.dadFalling }))
    } else if (x > 50 && x < 120 && y > rect.height - 250 && y < rect.height - 150) {
      setAnimationState((prev) => ({ ...prev, snowballFight: !prev.snowballFight }))
    } else if (x > 150 && x < 290 && y > rect.height - 280 && y < rect.height - 200) {
      setAnimationState((prev) => ({ ...prev, iceSkatersSlip: !prev.iceSkatersSlip }))
    } else if (x > 300 && x < 400 && y > 170 && y < 260) {
      setAnimationState((prev) => ({ ...prev, gossipFence: !prev.gossipFence }))
    } else if (x > 450 && x < 550 && y > rect.height - 300 && y < rect.height - 150) {
      setAnimationState((prev) => ({ ...prev, sleddingWipeout: !prev.sleddingWipeout }))
    } else if (x > 580 && x < 680 && y > rect.height - 200 && y < rect.height - 150) {
      setAnimationState((prev) => ({ ...prev, marshmallowRoast: !prev.marshmallowRoast }))
    } else if (x > 320 && x < 360 && y > rect.height - 180 && y < rect.height - 160) {
      setAnimationState((prev) => ({ ...prev, carolersSinging: !prev.carolersSinging }))
    } else if (x > 260 && x < 290 && y > rect.height - 175 && y < rect.height - 155) {
      setAnimationState((prev) => ({ ...prev, mailmanDelivering: !prev.mailmanDelivering }))
    } else if (x > 145 && x < 205 && y > 240 && y < 280) {
      setAnimationState((prev) => ({ ...prev, mistletoeKiss: !prev.mistletoeKiss }))
    } else if (x > 670 && x < 750 && y > rect.height - 210 && y < rect.height - 150) {
      setAnimationState((prev) => ({ ...prev, hotCocoaStand: !prev.hotCocoaStand }))
    } else if (x > 25 && x < 75 && y > rect.height - 175 && y < rect.height - 135) {
      setAnimationState((prev) => ({ ...prev, choppingWood: !prev.choppingWood }))
    } else if (x > 150 && x < 180 && y > 90 && y < 120) {
      setAnimationState((prev) => ({ ...prev, santaStuckChimney: !prev.santaStuckChimney }))
    } else if (x > 340 && x < 375 && y > rect.height - 250 && y < rect.height - 225) {
      setAnimationState((prev) => ({ ...prev, catInTree: !prev.catInTree }))
    } else if (x > 420 && x < 470 && y > 235 && y < 265) {
      setAnimationState((prev) => ({ ...prev, proposal: !prev.proposal }))
    } else if (x > 360 && x < 400 && y > rect.height - 225 && y < rect.height - 150) {
      setAnimationState((prev) => ({ ...prev, decoratingTree: !prev.decoratingTree }))
    }
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-blue-100 to-white p-8 shadow-2xl">
      <div className="relative">
        <canvas ref={canvasRef} className="w-full h-[600px] rounded-lg cursor-pointer" onClick={handleClickCanvas} />

        {!hasStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-900/20 backdrop-blur-sm rounded-lg">
            <Button
              size="lg"
              onClick={handleStart}
              className="bg-red-600 hover:bg-red-700 text-white text-xl px-8 py-6 shadow-xl"
            >
              <Play className="mr-2 h-6 w-6" />
              Start the Story
            </Button>
          </div>
        )}

        {showReplay && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button onClick={handleStart} variant="secondary" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Watch Again
            </Button>
            <Button onClick={handleShare} variant="secondary" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Click anywhere on the village to trigger individual scenes!
      </div>
    </Card>
  )
}
