// Generated from designs/material-design/classes.json by scripts/build-components.mjs.
// Do not edit by hand — change classes.json and re-run the generator.
import * as React from "react"

import { cn } from "@/lib/utils"

function SidebarNav({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="sidebar-nav" className={cn("w-64 rounded-lg border border-sidebar-border bg-sidebar p-2 text-sidebar-foreground", className)} {...props} />
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
      className={cn(active ? "flex h-8 items-center gap-2.5 rounded-md bg-sidebar-accent px-2 text-sm font-medium text-sidebar-accent-foreground" : "flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="sidebar-group-label" className={cn("px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground", className)} {...props} />
}

export { SidebarNav, SidebarNavItem, SidebarGroupLabel }
