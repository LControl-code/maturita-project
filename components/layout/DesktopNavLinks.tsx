"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Devices', href: '/device' },
  { label: 'Stations', href: '/station' },
  { label: 'Graphs', href: '/graph' },
]

export const DesktopNavLinks: React.FC = () => {
  const pathname = usePathname()

  return (
    <nav className="ml-auto items-center gap-4 hidden md:flex" aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.label} href={item.href} >
            <Button
              variant="ghost"
              className={cn("transition-colors hover:text-primary",
                isActive && "bg-muted text-primary font-medium")}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}