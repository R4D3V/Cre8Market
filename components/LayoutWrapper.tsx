'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import FloatingIcons from './FloatingIcons'
import InstallPopup from './InstallPopup'
import MobileBottomNav from './MobileBottomNav'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  const hideBottomNav =
    pathname.startsWith('/admin') || pathname.startsWith('/dashboard')

  return (
    <>
      <FloatingIcons />
      <InstallPopup />
      <div className="relative z-10">
        {children}
      </div>
      {!hideBottomNav && <MobileBottomNav />}
    </>
  )
}
