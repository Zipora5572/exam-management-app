"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface ChartContainerProps {
  children: React.ReactNode
}

const ChartContainer = ({ children }: ChartContainerProps) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Cleanup function to destroy any Chart instances when component unmounts
    return () => {
      if (chartRef.current) {
        const chartInstances = Chart.getChart(chartRef.current)
        if (chartInstances) {
          chartInstances.destroy()
        }
      }
    }
  }, [])

  return (
    <div ref={chartRef} className="h-[300px]">
      {children}
    </div>
  )
}

export default ChartContainer
