// Generated from designs/learn/classes.json by scripts/build-components.mjs.
// Do not edit by hand — change classes.json and re-run the generator.
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "",
  {
    variants: {
      intent: {
        info: "flex gap-3 rounded-xl border-2 border-border bg-muted/40 p-4",
        success: "flex gap-3 rounded-xl border border-chart-3/30 bg-chart-3/10 p-4",
        warning: "flex gap-3 rounded-xl border border-chart-4/30 bg-chart-4/10 p-4",
        destructive: "flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4",
      },
    },
    defaultVariants: { intent: "info" },
  }
)

function Alert({
  className,
  intent,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div role="alert" data-slot="alert" className={cn(alertVariants({ intent, className }))} {...props} />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("text-sm font-medium", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
