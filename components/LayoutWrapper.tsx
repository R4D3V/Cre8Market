'use client'

import { useEffect } from 'react'
import FloatingIcons from './FloatingIcons'
import InstallPopup from './InstallPopup'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  return (
    <>
      <FloatingIcons />
      <InstallPopup />
      <div className="relative z-10">
        {children}
      </div>
    </>
  )
}
