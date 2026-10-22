'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import FloatingIcons from './FloatingIcons'
import InstallPopup from './InstallPopup'
import MobileBottomNav from './MobileBottomNav'
import InAppNotificationToast from './InAppNotificationToast'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error("Service worker registration failed:", err);
      });
    }
  }, [])

  const hideBottomNav =
    pathname.startsWith('/admin') || pathname.startsWith('/dashboard')

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[300] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
      >
        Skip to content
      </a>
      <FloatingIcons />
      <InstallPopup />
      <InAppNotificationToast />
      <div id="main-content" className="relative z-10" tabIndex={-1}>
        {children}
      </div>
      {!hideBottomNav && <MobileBottomNav />}
    </>
  )
}
