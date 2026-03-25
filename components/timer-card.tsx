"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, RotateCcw, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TimerCardProps {
  id: string
  onDelete: (id: string) => void
  isOnly: boolean
}

export function TimerCard({ id, onDelete, isOnly }: TimerCardProps) {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(5 * 60)
  const [remainingSeconds, setRemainingSeconds] = useState(5 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [editingField, setEditingField] = useState<"hours" | "minutes" | "seconds" | null>(null)
  const [editValue, setEditValue] = useState("")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 初始化音频
  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAAAAAAAAAAAAAAAAAAAAAAAA==")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // 计时逻辑
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsFinished(true)
            if (audioRef.current) {
              audioRef.current.play().catch(() => {})
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  // 更新显示时间
  useEffect(() => {
    const h = Math.floor(remainingSeconds / 3600)
    const m = Math.floor((remainingSeconds % 3600) / 60)
    const s = remainingSeconds % 60
    setHours(h)
    setMinutes(m)
    setSeconds(s)
  }, [remainingSeconds])

  const handleStart = useCallback(() => {
    if (remainingSeconds > 0) {
      setIsRunning(true)
      setIsFinished(false)
    }
  }, [remainingSeconds])

  const handlePause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setIsFinished(false)
    setRemainingSeconds(totalSeconds)
  }, [totalSeconds])

  const handleFieldClick = (field: "hours" | "minutes" | "seconds") => {
    if (isRunning) return
    setEditingField(field)
    const value = field === "hours" ? hours : field === "minutes" ? minutes : seconds
    setEditValue(value.toString().padStart(2, "0"))
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2)
    setEditValue(value)
  }

  const handleFieldBlur = () => {
    if (editingField) {
      let value = parseInt(editValue) || 0
      if (editingField === "hours") {
        value = Math.min(99, Math.max(0, value))
        setHours(value)
      } else if (editingField === "minutes") {
        value = Math.min(59, Math.max(0, value))
        setMinutes(value)
      } else {
        value = Math.min(59, Math.max(0, value))
        setSeconds(value)
      }

      const newHours = editingField === "hours" ? value : hours
      const newMinutes = editingField === "minutes" ? value : minutes
      const newSeconds = editingField === "seconds" ? value : seconds
      const newTotal = newHours * 3600 + newMinutes * 60 + newSeconds
      setTotalSeconds(newTotal)
      setRemainingSeconds(newTotal)
      setEditingField(null)
      setIsFinished(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFieldBlur()
    }
  }

  const formatNumber = (num: number) => num.toString().padStart(2, "0")

  const progress = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "bg-card border-border shadow-lg hover:shadow-xl",
        isFinished && "animate-pulse border-accent"
      )}
    >
      {/* 装饰性时钟图标 */}
      <div className="absolute top-4 right-4 opacity-10">
        <Clock className="w-16 h-16 text-primary" />
      </div>

      {/* 进度条 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6 md:p-8">
        {/* 时间显示 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {/* 小时 */}
          <div className="relative">
            {editingField === "hours" ? (
              <input
                type="text"
                value={editValue}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-20 md:w-28 text-5xl md:text-7xl font-mono font-bold text-center bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            ) : (
              <button
                onClick={() => handleFieldClick("hours")}
                disabled={isRunning}
                className={cn(
                  "w-20 md:w-28 text-5xl md:text-7xl font-mono font-bold text-center rounded-lg transition-colors",
                  "hover:bg-muted/50 disabled:hover:bg-transparent",
                  isFinished ? "text-accent" : "text-foreground"
                )}
              >
                {formatNumber(hours)}
              </button>
            )}
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              时
            </span>
          </div>

          <span className={cn("text-5xl md:text-7xl font-mono font-bold", isFinished ? "text-accent" : "text-foreground")}>:</span>

          {/* 分钟 */}
          <div className="relative">
            {editingField === "minutes" ? (
              <input
                type="text"
                value={editValue}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-20 md:w-28 text-5xl md:text-7xl font-mono font-bold text-center bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            ) : (
              <button
                onClick={() => handleFieldClick("minutes")}
                disabled={isRunning}
                className={cn(
                  "w-20 md:w-28 text-5xl md:text-7xl font-mono font-bold text-center rounded-lg transition-colors",
                  "hover:bg-muted/50 disabled:hover:bg-transparent",
                  isFinished ? "text-accent" : "text-foreground"
                )}
              >
                {formatNumber(minutes)}
              </button>
            )}
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              分
            </span>
          </div>

          <span className={cn("text-5xl md:text-7xl font-mono font-bold", isFinished ? "text-accent" : "text-foreground")}>:</span>

          {/* 秒 */}
          <div className="relative">
            {editingField === "seconds" ? (
              <input
                type="text"
                value={editValue}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-20 md:w-28 text-5xl md:text-7xl font-mono font-bold text-center bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            ) : (
              <button
                onClick={() => handleFieldClick("seconds")}
                disabled={isRunning}
                className={cn(
                  "w-20 md:w-28 text-5xl md:text-7xl font-mono font-bold text-center rounded-lg transition-colors",
                  "hover:bg-muted/50 disabled:hover:bg-transparent",
                  isFinished ? "text-accent" : "text-foreground"
                )}
              >
                {formatNumber(seconds)}
              </button>
            )}
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              秒
            </span>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {isRunning ? (
            <Button
              onClick={handlePause}
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-2"
            >
              <Pause className="w-5 h-5" />
              暂停
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              size="lg"
              disabled={remainingSeconds === 0 && !isFinished}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Play className="w-5 h-5" />
              开始
            </Button>
          )}

          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            重置
          </Button>

          {!isOnly && (
            <Button
              onClick={() => onDelete(id)}
              size="lg"
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
            >
              <Trash2 className="w-5 h-5" />
              删除
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
