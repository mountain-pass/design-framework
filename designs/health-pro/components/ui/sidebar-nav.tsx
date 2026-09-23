// Generated from designs/health-pro/classes.json by scripts/build-components.mjs.
// Do not edit by hand — change classes.json and re-run the generator.
import * as React from "react"

import { cn } from "@/lib/utils"

function SidebarNav({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="sidebar-nav" className={cn("w-64 border border-sidebar-border bg-sidebar p-2 text-sidebar-foreground", className)} {...props} />
}

function SidebarNavItem({
  className,
  active = false,
  ...props
}: React.ComponentProps<"a"> & { active?: boolean }) {
  return (
    <a
      data-slot="sidebar-nav-item"
      aria-current={active ? "page" : undefined}
      className={cn(active ? "flex h-10 items-center gap-2.5 bg-sidebar-primary px-2 text-sm font-bold uppercase tracking-[0.05em] text-sidebar-primary-foreground" : "flex h-10 items-center gap-2.5 px-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="sidebar-group-label" className={cn("px-2 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-sidebar-foreground/60", className)} {...props} />
}

export { SidebarNav, SidebarNavItem, SidebarGroupLabel }
