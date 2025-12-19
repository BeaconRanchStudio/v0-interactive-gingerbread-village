"use client"

import { InteractiveZoomVillage } from "@/components/village/interactive-zoom-village"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <InteractiveZoomVillage />
    </div>
  )
}
