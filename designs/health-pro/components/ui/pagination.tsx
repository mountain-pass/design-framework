// Generated from designs/health-pro/classes.json by scripts/build-components.mjs.
// Do not edit by hand — change classes.json and re-run the generator.
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav role="navigation" aria-label="Pagination" data-slot="pagination" className={cn("flex flex-wrap items-center gap-1", className)} {...props} />
}

function PaginationLink({ className, isActive, ...props }: React.ComponentProps<"button"> & { isActive?: boolean }) {
  return (
    <button
      data-slot="pagination-link"
      aria-current={isActive ? "page" : undefined}
      className={cn(isActive ? "inline-flex h-10 w-10 items-center justify-center border border-input bg-background text-sm font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" : "inline-flex h-10 w-10 items-center justify-center text-sm tabular-nums transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    />
  )
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button data-slot="pagination-previous" aria-label="Go to previous page" className={cn("inline-flex h-10 items-center gap-1 px-3 text-xs font-bold uppercase tracking-[0.05em] transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...props}>
      <ChevronLeft className="h-4 w-4" />
      Previous
    </button>
  )
}

function PaginationNext({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button data-slot="pagination-next" aria-label="Go to next page" className={cn("inline-flex h-10 items-center gap-1 px-3 text-xs font-bold uppercase tracking-[0.05em] transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...props}>
      Next
      <ChevronRight className="h-4 w-4" />
    </button>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="pagination-ellipsis" aria-hidden className={cn("inline-flex h-10 w-10 items-center justify-center text-sm text-muted-foreground", className)} {...props}>…</span>
  )
}

export { Pagination, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis }
