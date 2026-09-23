// Generated from designs/health-pro/classes.json by scripts/build-components.mjs.
// Do not edit by hand — change classes.json and re-run the generator.
import * as React from "react"

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("animate-pulse bg-muted", className)} {...props} />
}

export { Skeleton }
