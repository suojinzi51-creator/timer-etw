"use client"

import { useEffect, useState } from "react"

export function ClockDecoration() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const secondsDegrees = (time.getSeconds() / 60) * 360
  const minutesDegrees = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360
  const hoursDegrees = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360

  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      {/* 外圈 */}
      <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
      
      {/* 刻度 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-3 bg-primary/30 rounded-full"
          style={{
            top: "8px",
            left: "50%",
            transform: `translateX(-50%) rotate(${i * 30}deg)`,
            transformOrigin: "50% 56px",
          }}
        />
      ))}

      {/* 中心点 */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary z-10" />

      {/* 时针 */}
      <div
        className="absolute top-1/2 left-1/2 w-1.5 h-8 md:h-10 -translate-x-1/2 origin-top rounded-full bg-foreground/80"
        style={{
          transform: `translateX(-50%) rotate(${hoursDegrees}deg)`,
          transformOrigin: "50% 0%",
        }}
      />

      {/* 分针 */}
      <div
        className="absolute top-1/2 left-1/2 w-1 h-12 md:h-14 -translate-x-1/2 origin-top rounded-full bg-foreground/60"
        style={{
          transform: `translateX(-50%) rotate(${minutesDegrees}deg)`,
          transformOrigin: "50% 0%",
        }}
      />

      {/* 秒针 */}
      <div
        className="absolute top-1/2 left-1/2 w-0.5 h-14 md:h-16 -translate-x-1/2 origin-top rounded-full bg-primary"
        style={{
          transform: `translateX(-50%) rotate(${secondsDegrees}deg)`,
          transformOrigin: "50% 0%",
        }}
      />
    </div>
  )
}
