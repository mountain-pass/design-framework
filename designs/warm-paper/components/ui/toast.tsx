// Generated from designs/warm-paper/classes.json by scripts/build-components.mjs.
// Do not edit by hand — change classes.json and re-run the generator.
import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitive.Provider

function ToastViewport({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn("fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-3 p-4 sm:max-w-md", className)}
      {...props}
    />
  )
}

function Toast({ className, variant = "default", ...props }: React.ComponentProps<typeof ToastPrimitive.Root> & { variant?: "default" | "destructive" }) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(variant === "destructive" ? "flex items-start gap-3 rounded-lg border border-destructive/30 bg-popover p-4 text-popover-foreground shadow-lg" : "flex items-start gap-3 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg", className)}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return <ToastPrimitive.Title data-slot="toast-title" className={cn("text-sm font-medium", className)} {...props} />
}

function ToastDescription({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return <ToastPrimitive.Description data-slot="toast-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

function ToastClose({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return <ToastPrimitive.Close data-slot="toast-close" className={cn("-mr-1 -mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...props} />
}

function ToastAction({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return <ToastPrimitive.Action data-slot="toast-action" className={cn("inline-flex h-7 shrink-0 items-center rounded-md px-2.5 text-xs font-medium text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} {...props} />
}

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction }
