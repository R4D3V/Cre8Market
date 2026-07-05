'use client'

import FloatingIcons from './FloatingIcons'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FloatingIcons />
      <div className="relative z-10">
        {children}
      </div>
    </>
  )
}
