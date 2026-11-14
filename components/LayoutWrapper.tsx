'use client'

import { usePathname } from 'next/navigation'
import FloatingIcons from './FloatingIcons'
import InstallPrompt from './pwa/InstallPrompt'
import NotificationPrompt from './pwa/NotificationPrompt'
import NetworkStatus from './pwa/NetworkStatus'
import AppBadgeClearer from './pwa/AppBadgeClearer'
import MobileBottomNav from './MobileBottomNav'
import InAppNotificationToast from './InAppNotificationToast'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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
      <NetworkStatus />
      <AppBadgeClearer />
      <InstallPrompt />
      <NotificationPrompt />
      <InAppNotificationToast />
      <div id="main-content" className="relative z-10" tabIndex={-1}>
        {children}
      </div>
      {!hideBottomNav && (
        <>
          {/* Room for the floating tab bar plus the home-indicator inset. */}
          <div className="sm:hidden" style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)' }} aria-hidden="true" />
          <MobileBottomNav />
        </>
      )}
    </>
  )
}
