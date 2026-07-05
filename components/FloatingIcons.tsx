'use client'

import { useEffect, useState } from 'react'

const icons = ['📱', '💻', '🖥️', '📺', '🚗', '👟', '👗', '⌚', '🎧', '🔌', '📷', '🧊', '🛋️', '🏠', '📦']

const animations = ['float-lr']

interface FloatingIcon {
  icon: string
  y: number
  size: number
  duration: number
  delay: number
}

export default function FloatingIcons() {
  const [items, setItems] = useState<FloatingIcon[]>([])

  useEffect(() => {
    const generated: FloatingIcon[] = icons.map((icon) => ({
      icon,
      y: Math.random() * 100,
      size: 16 + Math.random() * 48,
      duration: 24 + Math.random() * 24,
      delay: Math.random() * 20,
    }))
    setItems(generated)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            opacity: 0.08,
            animation: `float-lr ${item.duration}s linear ${item.delay}s infinite`,
          }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  )
}
