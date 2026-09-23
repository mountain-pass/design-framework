// Generated from designs/learn/classes.json by scripts/build-components.mjs.
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
      className={cn(isActive ? "inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-input bg-background text-sm font-medium tabular-nums shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" : "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm tabular-nums transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    />
  )
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button data-slot="pagination-previous" aria-label="Go to previous page" className={cn("inline-flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...props}>
      <ChevronLeft className="h-4 w-4" />
      Previous
    </button>
  )
}

function PaginationNext({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button data-slot="pagination-next" aria-label="Go to next page" className={cn("inline-flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...props}>
      Next
      <ChevronRight className="h-4 w-4" />
    </button>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="pagination-ellipsis" aria-hidden className={cn("inline-flex h-9 w-9 items-center justify-center text-sm text-muted-foreground", className)} {...props}>…</span>
  )
}

export { Pagination, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis }
