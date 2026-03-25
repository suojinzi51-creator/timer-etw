"use client"

import { useState, useCallback } from "react"
import { Plus, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TimerCard } from "@/components/timer-card"
import { ClockDecoration } from "@/components/clock-decoration"

export default function TimerPage() {
  const [timers, setTimers] = useState<string[]>([crypto.randomUUID()])

  const addTimer = useCallback(() => {
    setTimers((prev) => [...prev, crypto.randomUUID()])
  }, [])

  const deleteTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((timerId) => timerId !== id))
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Timer className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">在线计时器</h1>
          </div>
          
          <Button
            onClick={addTimer}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">添加计时器</span>
          </Button>
        </div>
      </header>

      {/* 装饰性背景 */}
      <div className="fixed top-1/4 -left-20 opacity-5 pointer-events-none">
        <div className="w-80 h-80 rounded-full border-8 border-primary" />
      </div>
      <div className="fixed bottom-1/4 -right-20 opacity-5 pointer-events-none">
        <div className="w-60 h-60 rounded-full border-8 border-accent" />
      </div>

      {/* 主内容区 */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* 实时时钟装饰 */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex flex-col items-center gap-4">
            <ClockDecoration />
            <p className="text-sm text-muted-foreground">当前时间</p>
          </div>
        </div>

        {/* 计时器列表 */}
        <div className="grid gap-6 md:gap-8 max-w-3xl mx-auto">
          {timers.map((id, index) => (
            <div key={id} className="relative">
              {timers.length > 1 && (
                <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {index + 1}
                </div>
              )}
              <TimerCard
                id={id}
                onDelete={deleteTimer}
                isOnly={timers.length === 1}
              />
            </div>
          ))}
        </div>

        {/* 使用说明 */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              使用说明
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>点击数字可直接编辑时间（时:分:秒）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>每个计时器都有独立的开始、暂停、重置和删除按钮</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>点击右上角「添加计时器」可创建多个计时器</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>计时结束时会有提示音提醒</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>简洁、高效的在线计时工具</p>
        </div>
      </footer>
    </main>
  )
}
